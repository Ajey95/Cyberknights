import { Link } from 'react-router-dom';
import SignupForm from '../components/auth/SignupForm';

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-orange-600 px-6 py-8 text-white">
          <h1 className="text-2xl font-bold mb-2">Create an Account</h1>
          <p className="text-orange-100">
            Join TypeSymphony to start your typing adventure
          </p>
        </div>
        
        <div className="p-6">
          <SignupForm />
          
          <div className="mt-6 text-center text-sm">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-orange-600 hover:underline font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;