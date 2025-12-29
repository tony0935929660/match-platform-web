import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface LineLoginButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost";
}

export function LineLoginButton({ 
  className, 
  size = "default",
  variant = "default" 
}: LineLoginButtonProps) {
  const { login } = useAuth();

  return (
    <Button
      onClick={login}
      size={size}
      variant={variant}
      className={`bg-[#00B900] hover:bg-[#00A000] text-white gap-2 ${className}`}
    >
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2C6.48 2 2 5.73 2 10.25c0 3.93 3.5 7.28 8.2 8.14.32.07.76.22.87.5.1.26.07.66.03.92l-.14.86c-.04.26-.2 1.02.89.56.98-.41 5.37-3.16 7.32-5.41C21.16 13.58 22 11.99 22 10.25 22 5.73 17.52 2 12 2zm-3.5 11.36H6.74c-.35 0-.63-.28-.63-.63V8.65c0-.35.28-.63.63-.63.35 0 .63.28.63.63v3.45h1.13c.35 0 .63.28.63.63 0 .35-.28.63-.63.63zm2.13-.63c0 .35-.28.63-.63.63-.35 0-.63-.28-.63-.63V8.65c0-.35.28-.63.63-.63.35 0 .63.28.63.63v4.08zm4.93 0c0 .28-.18.52-.44.6-.06.02-.12.03-.19.03-.22 0-.42-.12-.54-.3l-1.7-2.32v1.99c0 .35-.28.63-.63.63-.35 0-.63-.28-.63-.63V8.65c0-.28.18-.52.44-.6.06-.02.12-.03.19-.03.22 0 .42.12.54.3l1.7 2.32V8.65c0-.35.28-.63.63-.63.35 0 .63.28.63.63v4.08zm2.69-2.82c.35 0 .63.28.63.63 0 .35-.28.63-.63.63h-1.13v.93h1.13c.35 0 .63.28.63.63 0 .35-.28.63-.63.63h-1.76c-.35 0-.63-.28-.63-.63V8.65c0-.35.28-.63.63-.63h1.76c.35 0 .63.28.63.63 0 .35-.28.63-.63.63h-1.13v.63h1.13z"/>
      </svg>
      使用 LINE 登入
    </Button>
  );
}
