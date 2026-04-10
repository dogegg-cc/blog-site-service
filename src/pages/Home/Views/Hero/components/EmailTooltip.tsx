import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import styles from '../Hero.module.less';

interface EmailTooltipProps {
  email?: string;
  show: boolean;
  isCopied: boolean;
  onCopy: (e: React.MouseEvent) => void;
  onMouseEnter?: () => void;
}

const EmailTooltip: React.FC<EmailTooltipProps> = ({
  email,
  show,
  isCopied,
  onCopy,
  onMouseEnter,
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={styles.emailTooltip}
          initial={{ opacity: 0, scale: 0.9, y: 10, x: '-50%' }}
          animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, scale: 0.9, y: 10, x: '-50%' }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onMouseEnter={onMouseEnter} // 停留在弹窗上保持显示
        >
          <span className={styles.emailText}>{email}</span>
          <button className={styles.copyBtn} onClick={onCopy}>
            {isCopied ? <Check /> : <Copy />}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(EmailTooltip);
