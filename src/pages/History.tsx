import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getGameRecords } from '@/utils/storage';
import Background from '@/components/layout/Background';

export default function History() {
  const navigate = useNavigate();
  const records = getGameRecords();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-12">
      <Background />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 px-4 w-full max-w-4xl"
      >
        <h1 className="ink-title text-5xl font-bold mb-8">
          人生记录
        </h1>

        {records.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-2xl text-[#45564f] mb-8">还没有记录</p>
            <button
              onClick={() => navigate('/')}
              className="ink-button-primary text-lg"
            >
              开始第一次修仙
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {records.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="ink-panel rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#a94d37] text-xl font-bold text-[#a94d37]">
                      {record.result === 'ascended' ? '仙' : '终'}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-[#355d58]">
                        {record.finalRealm}
                      </h3>
                      <p className="ink-muted text-sm">
                        {new Date(record.date).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#9a5b2f]">
                      {record.age} 岁
                    </p>
                    <p className="ink-muted text-sm">
                      {record.result === 'ascended' ? '飞升' : '陨落'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <p className="text-[#45564f]">
                    天赋: <span className="text-[#9a5b2f]">{record.talent}</span>
                  </p>
                  <div className="flex space-x-4 text-[#59645f]">
                    <span>根骨: {record.stats.根骨}</span>
                    <span>悟性: {record.stats.悟性}</span>
                    <span>气运: {record.stats.气运}</span>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: records.length * 0.1 }}
              onClick={() => navigate('/')}
              className="ink-button-primary w-full mt-8 text-lg"
            >
              再来一局
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
