import { Link } from "react-router-dom";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  linkText: string;
  linkTo: string;
  linkLabel: string;
}

const AuthHeader = ({
  title,
  subtitle,
  linkText,
  linkTo,
  linkLabel,
}: AuthHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6">{subtitle}</p>
      <p className="text-sm text-muted-foreground">
        {linkText}{" "}
        <Link
          to={linkTo}
          className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
        >
          {linkLabel}
        </Link>
      </p>
    </div>
  );
};

export default AuthHeader;
