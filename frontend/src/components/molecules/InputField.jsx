import Label from '../atoms/Label';
import Input from '../atoms/Input';

export default function InputField({ 
  label, 
  required = false,
  error,
  id,
  ...inputProps 
}) {
  return (
    <div className="w-full">
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      <Input id={id} required={required} {...inputProps} />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}