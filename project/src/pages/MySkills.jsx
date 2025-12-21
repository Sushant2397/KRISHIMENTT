import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import skillsService from '../services/skillsService';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  TrendingUp,
  Star,
  BookOpen,
  Briefcase
} from 'lucide-react';

const MySkills = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [categories, setCategories] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [formData, setFormData] = useState({
    skill_name: '',
    category: '',
    experience_level: '',
    years_of_experience: 0,
    description: '',
    certifications: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'labour') {
      navigate('/dashboard');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [skillsRes, categoriesRes, levelsRes] = await Promise.all([
        skillsService.getMySkills(),
        skillsService.getCategories(),
        skillsService.getExperienceLevels()
      ]);
      setSkills(skillsRes.data || []);
      setCategories(categoriesRes.data || []);
      setExperienceLevels(levelsRes.data || []);
    } catch (e) {
      console.error('Failed to load skills:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (skill = null) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        skill_name: skill.skill_name,
        category: skill.category,
        experience_level: skill.experience_level,
        years_of_experience: skill.years_of_experience,
        description: skill.description || '',
        certifications: skill.certifications || ''
      });
    } else {
      setEditingSkill(null);
      setFormData({
        skill_name: '',
        category: '',
        experience_level: '',
        years_of_experience: 0,
        description: '',
        certifications: ''
      });
    }
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSkill(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingSkill) {
        await skillsService.updateSkill(editingSkill.id, formData);
      } else {
        await skillsService.createSkill(formData);
      }
      await loadData();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.error || t('Failed to save skill. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (skillId) => {
    if (!window.confirm(t('Are you sure you want to delete this skill?'))) return;

    try {
      await skillsService.deleteSkill(skillId);
      await loadData();
    } catch (err) {
      alert(t('Failed to delete skill. Please try again.'));
    }
  };

  const getExperienceColor = (level) => {
    const colors = {
      beginner: 'bg-blue-100 text-blue-800',
      intermediate: 'bg-green-100 text-green-800',
      advanced: 'bg-yellow-100 text-yellow-800',
      expert: 'bg-purple-100 text-purple-800'
    };
    return colors[level] || colors.beginner;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      planting: '🌱',
      harvesting: '🌾',
      irrigation: '💧',
      pest_control: '🐛',
      plowing: '🚜',
      fertilizing: '🌿',
      pruning: '✂️',
      livestock: '🐄',
      machinery: '⚙️',
      organic_farming: '🌍',
      other: '📋'
    };
    return icons[category] || '📋';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 via-blue-50 to-green-100 min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <Award className="h-8 w-8 text-yellow-500 mr-3" />
              {t('My Skills')}
            </h1>
            <p className="text-gray-600">{t('Manage your agricultural skills and showcase your expertise')}</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            {t('Add Skill')}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('Total Skills')}</p>
                <p className="text-3xl font-bold text-gray-900">{skills.length}</p>
              </div>
              <Briefcase className="w-12 h-12 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('Total Experience')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {skills.reduce((sum, s) => sum + (s.years_of_experience || 0), 0)} {t('years')}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('Expert Level Skills')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {skills.filter(s => s.experience_level === 'expert').length}
                </p>
              </div>
              <Star className="w-12 h-12 text-yellow-500" />
            </div>
          </motion.div>
        </div>

        {/* Skills Grid */}
        {skills.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-12 text-center"
          >
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('No Skills Added Yet')}</h3>
            <p className="text-gray-600 mb-6">{t('Start showcasing your expertise by adding your first skill')}</p>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              {t('Add Your First Skill')}
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getCategoryIcon(skill.category)}</span>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{skill.skill_name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{skill.category.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(skill)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{t('Experience')}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getExperienceColor(skill.experience_level)}`}>
                        {skill.experience_level}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{t('Years')}</span>
                      <span className="font-semibold text-gray-900">{skill.years_of_experience} {t('years')}</span>
                    </div>

                    {skill.description && (
                      <p className="text-sm text-gray-700 line-clamp-2">{skill.description}</p>
                    )}

                    {skill.certifications && (
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">{t('Certifications')}</p>
                        <p className="text-sm text-gray-700">{skill.certifications}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingSkill ? t('Edit Skill') : t('Add New Skill')}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Skill Name')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.skill_name}
                      onChange={(e) => setFormData({ ...formData, skill_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={t('e.g., Crop Harvesting')}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('Category')} *
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">{t('Select Category')}</option>
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('Experience Level')} *
                      </label>
                      <select
                        required
                        value={formData.experience_level}
                        onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">{t('Select Level')}</option>
                        {experienceLevels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Years of Experience')} *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.years_of_experience}
                      onChange={(e) => setFormData({ ...formData, years_of_experience: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Description')}
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      placeholder={t('Describe your experience with this skill...')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Certifications')}
                    </label>
                    <input
                      type="text"
                      value={formData.certifications}
                      onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={t('e.g., Certified Organic Farmer, Agricultural Diploma')}
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      disabled={submitting}
                    >
                      {t('Cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {t('Saving...')}
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          {t('Save Skill')}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MySkills;

