import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({
  label = 'Password',
  value,
  onChange,
  error,
  required = false,
  showStrength = false,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isActive = isFocused || value;

  const strength = useMemo(() => {
    if (!value || !showStrength) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^a-zA-Z0-9]/.test(value)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-destructive' };
    if (score <= 2) return { score: 2, label: 'Fair', color: 'bg-orange-500' };
    if (score <= 3) return { score: 3, label: 'Good', color: 'bg-yellow-500' };
    if (score <= 4) return { score: 4, label: 'Strong', color: 'bg-green-500' };
    return { score: 5, label: 'Excellent', color: 'bg-emerald-500' };
  }, [value, showStrength]);

  return (
    <div className="relative w-full">
      <motion.label
        initial={false}
        animate={{
          y: isActive ? -30 : 0,
          scale: isActive ? 0.85 : 1,
          x: isActive ? 0 : 0,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`
          absolute left-4 top-3 
          pointer-events-none origin-left
          transition-colors duration-200
          ${isActive ? 'text-primary text-base font-semibold' : 'text-muted-foreground text-lg'}
          ${error ? 'text-destructive' : ''}
        `}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </motion.label>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
          <Lock size={18} />
        </div>
        
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full pl-12 pr-12 py-4 rounded-xl
            bg-muted/50 border-2 text-foreground
            transition-all duration-300 ease-out
            ${error 
              ? 'border-destructive focus:border-destructive focus:ring-destructive/20' 
              : 'border-border focus:border-primary focus:ring-4 focus:ring-primary/10'
            }
            outline-none
          `}
          placeholder=""
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {showStrength && value && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2"
          >
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <motion.div
                  key={level}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: level <= strength.score ? 1 : 0.3 }}
                  className={`h-1 flex-1 rounded-full origin-left transition-colors ${
                    level <= strength.score ? strength.color : 'bg-border'
                  }`}
                />
              ))}
            </div>
            <p className={`text-xs ${strength.color.replace('bg-', 'text-')}`}>
              {strength.label}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            className="text-destructive text-sm mt-1.5 pl-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
