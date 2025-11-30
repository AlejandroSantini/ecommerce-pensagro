import { ReactNode, MouseEventHandler } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export function Card({ children, className = '', hover = true, onClick }: CardProps) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${
        hover ? 'hover:shadow-md transition-shadow' : ''
      } ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      } : undefined}
    >
      {children}
    </div>
  );
}

interface CardImageProps {
  children: ReactNode;
  className?: string;
}

export function CardImage({ children, className = '' }: CardImageProps) {
  return (
    <div className={`relative overflow-hidden bg-gray-50 ${className}`}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return <div className={`p-5 pb-3 ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return <h3 className={`font-medium text-lg text-gray-800 ${className}`}>{children}</h3>;
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
  return <p className={`text-gray-600 text-sm ${className}`}>{children}</p>;
}
