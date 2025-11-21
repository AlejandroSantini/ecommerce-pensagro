interface VariantCardProps {
  variant: {
    id: string | number;
    name?: string;
    nombre?: string;
  };
  variantPrice: number;
  isSelected: boolean;
  onSelect: () => void;
}

export function VariantCard({ variant, variantPrice, isSelected, onSelect }: VariantCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`relative w-full p-4 border-2 rounded-lg transition-all duration-200 text-left ${
        isSelected
          ? 'border-[#003c6f] bg-blue-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-[#003c6f] hover:shadow-sm'
      }`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-[#003c6f] rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      <div className="flex flex-col">
        <span className={`font-semibold text-base ${isSelected ? 'text-[#003c6f]' : 'text-gray-900'}`}>
          {variant.name || variant.nombre}
        </span>
      </div>

      <div className={`text-lg font-bold mt-2 ${isSelected ? 'text-[#003c6f]' : 'text-green-600'}`}>
        ${variantPrice.toLocaleString('es-AR')}
      </div>
    </button>
  );
}
