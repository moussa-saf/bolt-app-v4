interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'white' | 'gray';
}

export default function LoadingSpinner({ size = 'md', color = 'emerald' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-b-2'
  };

  const colorClasses = {
    emerald: 'border-emerald-600',
    white: 'border-white',
    gray: 'border-gray-600'
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]} border-t-transparent`}
        role="status"
        aria-label="Chargement"
      >
        <span className="sr-only">Chargement...</span>
      </div>
    </div>
  );
}
