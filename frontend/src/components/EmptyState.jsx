const EmptyState = ({ 
  icon: Icon, 
  emoji,
  title, 
  description, 
  action,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`card p-12 text-center animate-slide-up ${className}`}>
      {/* Icon or Emoji */}
      {emoji ? (
        <div className="text-6xl mb-4 animate-float">
          {emoji}
        </div>
      ) : Icon && (
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
          <Icon size={40} className="text-purple-400" />
        </div>
      )}

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-800 mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description}
      </p>

      {/* Action Button */}
      {(action || onAction) && (
        <div>
          {action || (
            <button
              onClick={onAction}
              className="btn-primary inline-flex items-center gap-2"
            >
              {actionText}
            </button>
          )}
        </div>
      )}

      {/* Decorative Elements */}
      <div className="mt-8 flex justify-center gap-2">
        <div className="w-2 h-2 rounded-full bg-purple-300 animate-pulse"></div>
        <div className="w-2 h-2 rounded-full bg-pink-300 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 rounded-full bg-blue-300 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

export default EmptyState;
