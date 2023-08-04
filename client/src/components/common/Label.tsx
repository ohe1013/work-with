interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    text: string;
}

const Label: React.FC<LabelProps> = ({ text, ...props }) => {
    return (
        <label {...props} className="block text-sm font-medium leading-6 text-gray-900">
            {text}
        </label>
    );
};

export default Label;
