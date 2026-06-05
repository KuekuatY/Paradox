import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getGameRecords } from '@/utils/storage';
import Background from '@/components/layout/Background';

export default function History() {
  const navigate = useNavigate();
  const records = getGameRecords();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden px-3 py-6 sm:py-12">
      <Background />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-4xl text-center"
      >
        <h1 className="ink-title mb-6 text-3xl font-bold sm:mb-8 sm:text-5xl">
          人生记录
        </h1>

        {records.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center sm:py-20"
          >
            <p className="mb-6 text-xl text-[#45564f] sm:mb-8 sm:text-2xl">还没有记录</p>
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
                className="ink-panel rounded-lg p-4 sm:p-6"
              >
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#a94d37] text-lg font-bold text-[#a94d37] sm:h-12 sm:w-12 sm:text-xl">
                      {record.result === 'ascended' ? '仙' : '终'}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-[#355d58] sm:text-xl">
                        {record.finalRealm}
                      </h3>
                      <p className="ink-muted text-sm">
                        {new Date(record.date).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xl font-bold text-[#9a5b2f] sm:text-2xl">
                      {record.age} 岁
                    </p>
                    <p className="ink-muted text-sm">
                      {record.result === 'ascended' ? '飞升' : '陨落'}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-left text-[#45564f]">
                    <p>
                      灵根: <span className="text-[#355d58]">{record.spiritRoot || '旧档无记录'}</span>
                    </p>
                    <p>
                      天赋: <span className="text-[#9a5b2f]">{record.talent || '旧档无记录'}</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[#59645f]">
                    <span>根骨: {record.stats.根骨}</span>
                    <span>神识: {record.stats.神识}</span>
                    <span>悟性: {record.stats.悟性}</span>
                    <span>气运: {record.stats.气运}</span>
                    <span>颜值: {record.stats.颜值}</span>
                    <span>家境: {record.familyWealth}</span>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: records.length * 0.1 }}
              onClick={() => navigate('/')}
              className="ink-button-primary mt-6 w-full text-lg sm:mt-8"
            >
              再来一局
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
