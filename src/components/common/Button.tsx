interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isDisabled: boolean;
}

const Button: React.FC<ButtonProps> = ({ isDisabled, children, ...rest }) => {
    return (
        <button
            disabled={isDisabled}
            {...rest}
            className={
                "flex w-full justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6  shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" +
                (isDisabled
                    ? " text-black hover:bg-gray-600 hover:text-white"
                    : " bg-indigo-600 text-white hover:bg-indigo-800")
            }
        >
            {children}
        </button>
    );
};
export default Button;
