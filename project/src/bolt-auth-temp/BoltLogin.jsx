<motion.form
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: 20 }}
  onSubmit={handleSubmit(onSubmit)}
  className="space-y-5"
>
  <Input
    label="Email Address"
    type="email"
    icon={<Mail size={20} />}
    error={errors.email?.message}
    {...register('email')}
  />

  <Input
    label="Password"
    type="password"
    icon={<Lock size={20} />}
    error={errors.password?.message}
    {...register('password')}
  />

  <div className="flex items-center justify-between">
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        {...register('rememberMe')}
      />
      <span className="text-sm text-gray-600">Remember me</span>
    </label>
    <button
      type="button"
      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
    >
      Forgot password?
    </button>
  </div>

  <Button type="submit" variant="primary" fullWidth loading={loading}>
    Sign In
  </Button>
</motion.form>
