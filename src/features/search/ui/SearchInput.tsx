import { useState, type ChangeEvent } from 'react';
import { Input } from '@/shared/ui';
import { IoSearch } from 'react-icons/io5';

type SearchInputProps = {
  placeholder: string;
};

export const SearchInput = ({ placeholder }: SearchInputProps) => {
  const [value, setValue] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className='relative'>
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
    </div>
  );
};
