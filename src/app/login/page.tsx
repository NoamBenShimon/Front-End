import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
            {/* Background ambiance — two soft warm shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <div
                    className="absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full"
                    style={{
                        background:
                            'radial-gradient(circle, rgba(31, 122, 146, 0.10) 0%, transparent 70%)',
                    }}
                />
                <div
                    className="absolute -bottom-40 -right-32 w-[460px] h-[460px] rounded-full"
                    style={{
                        background:
                            'radial-gradient(circle, rgba(201, 123, 62, 0.10) 0%, transparent 70%)',
                    }}
                />
            </div>

            <div className="relative z-10 w-full">
                <LoginForm />
            </div>
        </div>
    );
}
