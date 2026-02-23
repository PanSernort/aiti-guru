import { useState, type FormEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import './LoginPage.css';
import logoSvg from '../../assets/icons/logo.svg';
import titleWelcome from '../../assets/icons/title-welcome.svg';
import subtitleAuth from '../../assets/icons/subtitle-auth.svg';
import lockSvg from '../../assets/icons/lock.svg';
import eyeOffSvg from '../../assets/icons/eye-off.svg';
import eyeSvg from '../../assets/icons/eye.svg';
import squareSvg from '../../assets/icons/square.svg';
import closeSvg from '../../assets/icons/close.svg';
import userIcon from '../../assets/icons/user.png';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ username: false, password: false });

  if (isAuthenticated) {
    return <Navigate to="/products" replace />;
  }

  const usernameError =
    touched.username && !username.trim() ? 'Введите логин' : '';
  const passwordError =
    touched.password && !password.trim() ? 'Введите пароль' : '';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ username: true, password: true });
    if (!username.trim() || !password.trim()) return;
    try {
      await login({ username: username.trim(), password }, rememberMe);
      navigate('/products');
    } catch {
      /* handled in store */
    }
  };

  return (
    <div className="login-page">
      {/* Outer card */}
      <div className="login-outer">
        {/* Inner card */}
        <div className="login-inner">
          {/* Logo — INSIDE inner card */}
          <div className="login-logo">
            <img src={logoSvg} alt="Logo" width={35} height={34} />
          </div>

          {/* Heading */}
          <div className="login-heading">
            <img src={titleWelcome} alt="Добро пожаловать!" className="login-title-svg" />
            <img src={subtitleAuth} alt="Пожалуйста, авторизируйтесь" className="login-subtitle-svg" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="login-form">
            {/* Fields group */}
            <div className="login-fields">
              {/* Username */}
              <div className="login-field">
                <label>Логин</label>
                <div className={`login-input-wrap${usernameError ? ' error' : ''}`}>
                  <img src={userIcon} alt="" className="login-input-icon" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, username: true }))}
                  />
                  {username && (
                    <button
                      type="button"
                      onClick={() => setUsername('')}
                      className="login-input-clear"
                    >
                      <img src={closeSvg} alt="×" width={14} height={16} />
                    </button>
                  )}
                </div>
                {usernameError && (
                  <span className="login-error">{usernameError}</span>
                )}
              </div>

              {/* Password */}
              <div className="login-field">
                <label>Пароль</label>
                <div className={`login-input-wrap${passwordError ? ' error' : ''}`}>
                  <img src={lockSvg} alt="" className="login-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="login-input-action"
                  >
                    <img src={showPassword ? eyeSvg : eyeOffSvg} alt="toggle" width={24} height={24} />
                  </button>
                </div>
                {passwordError && (
                  <span className="login-error">{passwordError}</span>
                )}
              </div>
            </div>

            {/* API error */}
            {error && <span className="login-api-error">{error}</span>}

            {/* Remember */}
            <label className="login-remember">
              <span
                className="login-checkbox"
                onClick={(e) => {
                  e.preventDefault();
                  setRememberMe(!rememberMe);
                }}
              >
                {rememberMe ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="4" fill="#242EDB" stroke="#242EDB" strokeWidth="2" />
                    <path d="M8 12L11 15L16 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <img src={squareSvg} alt="" width={24} height={24} />
                )}
              </span>
              <span className="login-remember-text">Запомнить данные</span>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                hidden
              />
            </label>

            {/* Actions */}
            <div className="login-actions">
              {/* Submit */}
              <button type="submit" disabled={isLoading} className="login-submit">
                {isLoading ? 'Вход...' : 'Войти'}
              </button>

              {/* Divider */}
              <div className="login-divider">
                <span />
                <p>или</p>
                <span />
              </div>
            </div>
          </form>

          {/* Register */}
          <p className="login-register">
            Нет аккаунта?{' '}
            <a href="#">Создать</a>
          </p>
        </div>
      </div>
    </div>
  );
};
