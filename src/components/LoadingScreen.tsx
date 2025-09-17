'use client';

import { useAuth } from '@/contexts/AuthContext';

export function LoadingScreen() {
  const { loadingStage, retryCount } = useAuth();

  const getProgressPercentage = () => {
    if (loadingStage.includes('Connecting')) return 25;
    if (loadingStage.includes('Checking authentication')) return 50;
    if (loadingStage.includes('Loading profile')) return 75;
    if (loadingStage.includes('Almost ready')) return 90;
    if (loadingStage.includes('failed') || loadingStage.includes('Timeout')) return 100;
    return 10;
  };

  const getStageIcon = () => {
    if (loadingStage.includes('failed') || loadingStage.includes('Timeout')) {
      return '⚠️';
    }
    if (loadingStage.includes('Almost ready')) {
      return '✅';
    }
    return '🔄';
  };

  const isError = loadingStage.includes('failed') || loadingStage.includes('Timeout');

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 max-w-md w-full px-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-gray-700 flex items-center justify-center bg-gray-800/50 backdrop-blur-sm">
            <span className="text-2xl">{getStageIcon()}</span>
          </div>
          {!isError && (
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-500 animate-spin"></div>
          )}
        </div>

        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-white">BlackAffiliate 2.0</h2>
          <p className="text-gray-300 text-lg">{loadingStage}</p>
          
          {retryCount > 0 && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <span>Спроба:</span>
              <div className="flex gap-1">
                {[1, 2, 3].map((attempt) => (
                  <div
                    key={attempt}
                    className={`w-2 h-2 rounded-full ${
                      attempt <= retryCount 
                        ? attempt === retryCount && !isError
                          ? 'bg-yellow-500 animate-pulse'
                          : 'bg-red-500'
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span>{retryCount}/3</span>
            </div>
          )}
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ease-out ${
              isError ? 'bg-red-500' : 'bg-gradient-to-r from-red-500 to-red-400'
            }`}
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>

        {isError && (
          <div className="text-center space-y-2">
            <p className="text-red-400 text-sm">Виникла проблема з підключенням</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
            >
              Оновити сторінку
            </button>
          </div>
        )}

        <div className="text-xs text-gray-500 text-center">
          Ініціалізація системи авторизації...
        </div>
      </div>
    </div>
  );
}