import React from 'react';
import { useAppContext } from '../../context/AppContext';

interface TourModalProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  onFinish: () => void;
}

const TourModal: React.FC<TourModalProps> = ({ step, setStep, onFinish }) => {
  const { theme, t } = useAppContext();

  const tourContent = [
    { title: t('tour.step1.title'), text: t('tour.step1.text') },
    { title: t('tour.step2.title'), text: t('tour.step2.text') },
    { title: t('tour.step3.title'), text: t('tour.step3.text') },
    { title: t('tour.step4.title'), text: t('tour.step4.text') },
    { title: t('tour.step5.title'), text: t('tour.step5.text') },
  ];
  
  const currentStep = tourContent[step - 1];
  const totalSteps = tourContent.length;
  
  // Si el tour ya ha terminado, no renderizar
  if (step === 0 || step > totalSteps) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className={`w-full max-w-md p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-2xl`}>
        <h2 className="text-xl font-semibold mb-3 text-black dark:text-white">{currentStep.title}</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">{currentStep.text}</p>
        
        <div className="flex justify-between items-center">
          <button onClick={onFinish} className="text-sm text-gray-500 dark:text-gray-400 hover:underline">{t('tour.skip')}</button>
          
          <div className="flex gap-3 items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {step}/{totalSteps}
            </span>
            
            {step > 1 && (
              <button 
                onClick={() => setStep(s => s - 1)} 
                className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-black dark:text-white"
              >
                {t('tour.prev')}
              </button>
            )}
            
            {step < totalSteps ? (
              <button 
                onClick={() => setStep(s => s + 1)} 
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white"
              >
                {t('tour.next')}
              </button>
            ) : (
              <button 
                onClick={onFinish} 
                className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-500 text-white"
              >
                {t('tour.finish')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourModal;