"""
Krishiment Route Optimization: Dijkstra (local) + Spatial Landmark Model (SLM) for long-distance.

- Road network: weighted graph with nodes (farms, labour, mandis, warehouses, markets)
  and edges (distance + travel time).
- Dijkstra's Algorithm: shortest path for local routing.
- SLM: landmark-based routing for cross-region trips using pre-computed landmark distances.
"""
import math
import heapq
from decimal import Decimal
from typing import List, Tuple, Optional, Dict, Any


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Distance between two points in km (Haversine)."""
    R = 6371
    lat1_rad = math.radians(float(lat1))
    lat2_rad = math.radians(float(lat2))
    dlat = math.radians(float(lat2) - float(lat1))
    dlon = math.radians(float(lon2) - float(lon1))
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def travel_time_min(distance_km: float, avg_speed_kmh: float = 30.0) -> int:
    """Estimate travel time in minutes (default 30 km/h for rural roads)."""
    return max(1, int(round((float(distance_km) / avg_speed_kmh) * 60)))


def edge_weight_km(distance_km: float, travel_time_minutes: Optional[int] = None) -> float:
    """
    Combined edge weight: distance (km) + time penalty so that path is cost-effective.
    Weight = distance_km + (travel_time_min / 60) * time_factor_km_equivalent
    Using time_factor ~ 0.5 means 1 hour ≈ 0.5 km extra cost (prioritize distance slightly).
    """
    if travel_time_minutes is None:
        travel_time_minutes = travel_time_min(distance_km)
    time_factor = 0.5  # 1 hour = 0.5 km equivalent
    return float(distance_km) + (travel_time_minutes / 60.0) * time_factor


# --- Graph representation (node_id -> list of (neighbor_id, weight))
# Node id: string like "origin", "dest", "labour_<id>", "landmark_<id>"


def dijkstra(
    graph: Dict[str, List[Tuple[str, float]]],
    start: str,
    end: str,
) -> Tuple[List[str], float]:
    """
    Dijkstra's Algorithm: returns (path as list of node ids, total cost) or ([], inf) if no path.
    """
    if start not in graph or end not in graph:
        return [], float("inf")
    dist = {n: float("inf") for n in graph}
    dist[start] = 0.0
    prev = {n: None for n in graph}
    # min-heap: (cost, node_id)
    heap = [(0.0, start)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue
        if u == end:
            break
        for v, w in graph.get(u, []):
            alt = dist[u] + w
            if alt < dist[v]:
                dist[v] = alt
                prev[v] = u
                heapq.heappush(heap, (alt, v))
    if dist[end] == float("inf"):
        return [], float("inf")
    path = []
    cur = end
    while cur is not None:
        path.append(cur)
        cur = prev[cur]
    path.reverse()
    return path, dist[end]


def build_local_graph(
    origin_lat: float,
    origin_lon: float,
    dest_lat: float,
    dest_lon: float,
    labour_nodes: List[Dict[str, Any]],
    landmark_nodes: List[Dict[str, Any]],
    landmark_distances: Dict[Tuple[str, str], Tuple[float, int]],
    connect_radius_km: float = 80.0,
) -> Tuple[Dict[str, List[Tuple[str, float]]], Dict[str, Dict[str, Any]]]:
    """
    Build weighted graph for local + landmark routing.
    labour_nodes: [{"id": "labour_1", "lat": ..., "lon": ..., "label": ...}, ...]
    landmark_nodes: [{"id": "landmark_1", "lat": ..., "lon": ..., "label": ...}, ...]
    landmark_distances: {(from_id, to_id): (distance_km, travel_time_min)}
    Returns (graph, node_info) where node_info[id] = {lat, lon, label, type}.
    """
    graph = {}
    node_info = {}

    def add_node(nid: str, lat: float, lon: float, label: str, ntype: str):
        node_info[nid] = {"lat": lat, "lon": lon, "label": label, "type": ntype}
        if nid not in graph:
            graph[nid] = []

    def add_edge(a: str, b: str, weight: float):
        if a not in graph:
            graph[a] = []
        graph[a].append((b, weight))

    add_node("origin", origin_lat, origin_lon, "Your location", "origin")
    add_node("dest", dest_lat, dest_lon, "Destination", "destination")

    for n in labour_nodes:
        nid = n["id"]
        add_node(nid, n["lat"], n["lon"], n.get("label", nid), "labour")
    for n in landmark_nodes:
        nid = n["id"]
        add_node(nid, n["lat"], n["lon"], n.get("label", nid), "landmark")

    # All nodes list for local edges (origin, dest, labours, landmarks)
    all_local = [("origin", origin_lat, origin_lon), ("dest", dest_lat, dest_lon)]
    for n in labour_nodes:
        all_local.append((n["id"], n["lat"], n["lon"]))
    for n in landmark_nodes:
        all_local.append((n["id"], n["lat"], n["lon"]))

    # Local edges: connect nodes within connect_radius_km (Haversine)
    for i, (uid, ulat, ulon) in enumerate(all_local):
        for j, (vid, vlat, vlon) in enumerate(all_local):
            if i >= j:
                continue
            d = haversine_km(ulat, ulon, vlat, vlon)
            if d <= connect_radius_km:
                t = travel_time_min(d)
                w = edge_weight_km(d, t)
                add_edge(uid, vid, w)
                add_edge(vid, uid, w)

    # Landmark-to-landmark edges from precomputed table (directed; add both directions)
    for (fid, tid), (d_km, t_min) in landmark_distances.items():
        if fid in graph and tid in graph:
            w = edge_weight_km(d_km, t_min)
            add_edge(fid, tid, w)
            add_edge(tid, fid, w)

    return graph, node_info


def route_via_slm(
    origin_lat: float,
    origin_lon: float,
    dest_lat: float,
    dest_lon: float,
    landmark_nodes: List[Dict[str, Any]],
    landmark_distances: Dict[Tuple[str, str], Tuple[float, int]],
    node_info: Dict[str, Dict[str, Any]],
) -> Tuple[List[str], float, str]:
    """
    Compute path from origin to destination via nearest landmarks (SLM).
    Returns (path_node_ids, total_cost, "slm").
    """
    if not landmark_nodes:
        return [], float("inf"), "slm"

    # Build landmark-only graph
    lm_graph = {n["id"]: [] for n in landmark_nodes}
    for (fid, tid), (d_km, t_min) in landmark_distances.items():
        if fid in lm_graph and tid in lm_graph:
            w = edge_weight_km(d_km, t_min)
            lm_graph[fid].append((tid, w))
            lm_graph[tid].append((fid, w))

    # Nearest landmark to origin and to destination
    def nearest_to(lat: float, lon: float):
        best_id, best_d = None, float("inf")
        for n in landmark_nodes:
            d = haversine_km(lat, lon, n["lat"], n["lon"])
            if d < best_d:
                best_d, best_id = d, n["id"]
        return best_id, best_d

    lm_origin_id, d_orig_lm = nearest_to(origin_lat, origin_lon)
    lm_dest_id, d_dest_lm = nearest_to(dest_lat, dest_lon)

    if lm_origin_id is None or lm_dest_id is None:
        return [], float("inf"), "slm"

    # Path between landmarks
    lm_path, lm_cost = dijkstra(lm_graph, lm_origin_id, lm_dest_id)
    if not lm_path:
        return [], float("inf"), "slm"

    # Full path: origin -> lm_origin -> ... -> lm_dest -> dest
    t_orig = travel_time_min(d_orig_lm)
    t_dest = travel_time_min(d_dest_lm)
    w_orig = edge_weight_km(d_orig_lm, t_orig)
    w_dest = edge_weight_km(d_dest_lm, t_dest)
    total_cost = w_orig + lm_cost + w_dest
    path = ["origin"] + lm_path + ["dest"]
    return path, total_cost, "slm"


# Threshold (km) above which we use SLM for long-distance
SLM_DISTANCE_THRESHOLD_KM = 50.0


def compute_optimal_route(
    origin_lat: float,
    origin_lon: float,
    dest_lat: float,
    dest_lon: float,
    labour_nodes: List[Dict[str, Any]],
    landmark_models,
    landmark_distance_models,
) -> Dict[str, Any]:
    """
    Compute optimal route using Dijkstra (local) or SLM (long-distance).
    landmark_models: queryset or list of Landmark.
    landmark_distance_models: queryset or list of LandmarkDistance.
    Returns dict: waypoints [{lat, lon, label}], total_distance_km, total_time_min, algorithm_used.
    """
    origin_lat = float(origin_lat)
    origin_lon = float(origin_lon)
    dest_lat = float(dest_lat)
    dest_lon = float(dest_lon)

    direct_km = haversine_km(origin_lat, origin_lon, dest_lat, dest_lon)

    # Landmark data
    landmarks = list(
        landmark_models.values("id", "name", "latitude", "longitude", "location_type")
    )
    landmark_nodes = [
        {
            "id": f"landmark_{lm['id']}",
            "lat": float(lm["latitude"]),
            "lon": float(lm["longitude"]),
            "label": lm["name"],
        }
        for lm in landmarks
    ]
    ld_list = list(
        landmark_distance_models.select_related("from_landmark", "to_landmark").all()
    )
    landmark_distances = {}
    for ld in ld_list:
        fid = f"landmark_{ld.from_landmark_id}"
        tid = f"landmark_{ld.to_landmark_id}"
        landmark_distances[(fid, tid)] = (
            float(ld.distance_km),
            int(ld.travel_time_min),
        )

    use_slm = direct_km > SLM_DISTANCE_THRESHOLD_KM and len(landmark_nodes) >= 2

    # Always build graph and node_info so we have lat/lon for all nodes (origin, dest, landmarks)
    graph, node_info = build_local_graph(
        origin_lat,
        origin_lon,
        dest_lat,
        dest_lon,
        labour_nodes,
        landmark_nodes,
        landmark_distances,
    )

    if use_slm:
        path, cost, algo = route_via_slm(
            origin_lat,
            origin_lon,
            dest_lat,
            dest_lon,
            landmark_nodes,
            landmark_distances,
            node_info,
        )
        if not path:
            use_slm = False
    else:
        path, cost = [], float("inf")
        algo = "dijkstra"

    if not use_slm:
        path, cost = dijkstra(graph, "origin", "dest")
        algo = "dijkstra"

    if not path:
        # Fallback: direct segment
        return {
            "waypoints": [
                {"lat": origin_lat, "lon": origin_lon, "label": "Start"},
                {"lat": dest_lat, "lon": dest_lon, "label": "End"},
            ],
            "total_distance_km": round(direct_km, 2),
            "total_time_min": travel_time_min(direct_km),
            "algorithm_used": "direct",
        }

    waypoints = []
    total_distance_km = 0.0
    total_time_min = 0
    for i, nid in enumerate(path):
        info = node_info.get(nid)
        if info:
            waypoints.append(
                {
                    "lat": info["lat"],
                    "lon": info["lon"],
                    "label": info.get("label", nid),
                }
            )
        if i > 0:
            prev_id = path[i - 1]
            prev_info = node_info.get(prev_id)
            if prev_info and info:
                d = haversine_km(
                    prev_info["lat"],
                    prev_info["lon"],
                    info["lat"],
                    info["lon"],
                )
                total_distance_km += d
                total_time_min += travel_time_min(d)

    return {
        "waypoints": waypoints,
        "total_distance_km": round(total_distance_km, 2),
        "total_time_min": total_time_min,
        "algorithm_used": algo,
    }
