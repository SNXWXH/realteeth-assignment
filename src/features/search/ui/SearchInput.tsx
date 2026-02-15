import { useState, type ChangeEvent, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/shared/ui';
import { IoSearch } from 'react-icons/io5';
import { searchLocation } from '@/shared/data/nominatim.api';
import koreaDistricts from '@/shared/data/korea_districts.json';

type SearchLocation = {
  placeId: number;
  displayName: string;
  lat: number;
  lon: number;
  type: string;
};

type SearchInputProps = {
  placeholder: string;
  onLocationSelect?: (location: SearchLocation) => void;
};

export const SearchInput = ({
  placeholder,
  onLocationSelect,
}: SearchInputProps) => {
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const [filteredDistricts, setFilteredDistricts] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    if (inputValue.trim() === '') {
      setFilteredDistricts([]);
      setIsDropdownOpen(false);
      return;
    }

    const filtered = (koreaDistricts as string[]).filter((district) =>
      district.includes(inputValue),
    );

    setFilteredDistricts(filtered);
    setIsDropdownOpen(filtered.length > 0);
  };

  const handleSelectDistrict = async (district: string) => {
    setValue(district);
    setIsDropdownOpen(false);
    setIsLoading(true);

    try {
      const formattedQuery = district.replace(/-/g, ' ');
      const results = await searchLocation(formattedQuery);

      if (results.length > 0) {
        const locationData = results[0];

        if (onLocationSelect) onLocationSelect(locationData);
        else
          navigate(`/city/${locationData.placeId}`, {
            state: { locationData },
          });
      }
    } catch (error) {
      console.error('위치 정보 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='relative' ref={dropdownRef}>
      <Input
        type='text'
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className='bg-white pl-10'
        maxLength={50}
      />
      <div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
        <IoSearch />
      </div>

      {isDropdownOpen && (
        <div className='absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto'>
          {filteredDistricts.map((district, index) => (
            <div
              key={`${district}-${index}`}
              className='px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm'
              onClick={() => handleSelectDistrict(district)}
            >
              {district.replace(/-/g, ' ')}
            </div>
          ))}
        </div>
      )}

      {isLoading && (
        <div className='absolute z-20 inset-0 bg-white/80 flex items-center justify-center rounded-md'>
          <div className='text-sm text-gray-600'>위치 정보 조회 중...</div>
        </div>
      )}
    </div>
  );
};
