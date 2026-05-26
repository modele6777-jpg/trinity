import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { motion } from 'motion/react';
import { TrendingUp, Palette, Brain, Heart, Zap, Sun, Star, Activity, Target } from 'lucide-react';

interface InsightChartsProps {
  history: any[];
}

export function InsightCharts({ history }: InsightChartsProps) {
  // 1. Energy Trend (Area Chart for more volume)
  const energyTrend = history
    .filter(h => h.type === 'DAILY' || h.type === 'QUICK')
    .slice(0, 10)
    .reverse()
    .map(h => {
      const date = h.createdAt?.toDate ? h.createdAt.toDate() : new Date();
      const text = (h.resonance?.diagnosis || h.quickInsight?.diagnosis || "").toLowerCase();
      let energy = 50;
      if (text.includes('좋') || text.includes('긍정') || text.includes('행운')) energy = 75;
      if (text.includes('나쁨') || text.includes('주의') || text.includes('조심')) energy = 25;
      if (text.includes('최고') || text.includes('대박')) energy = 95;
      
      return {
        name: `${date.getMonth() + 1}/${date.getDate()}`,
        energy,
        fullDate: date.toLocaleDateString()
      };
    });

  // 2. Luck Radar (Using real stats from history if available)
  const latestWithStats = history.find(h => (h.resonance?.stats || h.quickInsight?.stats));
  const stats = latestWithStats?.resonance?.stats || latestWithStats?.quickInsight?.stats || { hope: 65, reality: 55, intuition: 75, action: 45, emotion: 80 };

  const radarData = [
    { subject: '희망', A: stats.hope || 50, fullMark: 100 },
    { subject: '현실', A: stats.reality || 50, fullMark: 100 },
    { subject: '직관', A: stats.intuition || 50, fullMark: 100 },
    { subject: '실행', A: stats.action || 50, fullMark: 100 },
    { subject: '감성', A: stats.emotion || 50, fullMark: 100 },
  ];

  // 3. Lucky Color Distribution
  const colorMap = [
    { name: 'Red', color: '#ff4d4d', count: 0 },
    { name: 'Blue', color: '#4d79ff', count: 0 },
    { name: 'Gold', color: '#ffd700', count: 0 },
    { name: 'Green', color: '#4dff88', count: 0 },
    { name: 'Purple', color: '#b366ff', count: 0 },
  ];

  history.forEach(h => {
    const text = JSON.stringify(h).toLowerCase();
    if (text.includes('빨강') || text.includes('레드')) colorMap[0].count++;
    if (text.includes('파랑') || text.includes('블루')) colorMap[1].count++;
    if (text.includes('금색') || text.includes('골드') || text.includes('노랑')) colorMap[2].count++;
    if (text.includes('초록') || text.includes('그린')) colorMap[3].count++;
    if (text.includes('보라') || text.includes('퍼플')) colorMap[4].count++;
  });

  if (colorMap.every(c => c.count === 0)) {
    colorMap.forEach((c, i) => c.count = [3, 5, 2, 4, 1][i]);
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#1a1625', border: '1px solid rgba(200,169,110,0.3)', padding: '12px', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <p style={{ color: '#c8a96e', marginBottom: '4px', fontWeight: 'bold' }}>{payload[0].payload.fullDate || label}</p>
          <p style={{ color: '#fff' }}>에너지 지수: <span style={{ color: '#c8a96e', fontWeight: 'bold' }}>{payload[0].value}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Main Energy Area Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '28px', padding: '28px', backdropFilter: 'blur(20px)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(200,169,110,0.1)' }}>
              <Activity size={20} color="#c8a96e" />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>에너지 리듬</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>최근 10회 리딩 분석</div>
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#c8a96e', fontWeight: 'bold', background: 'rgba(200,169,110,0.1)', padding: '4px 10px', borderRadius: '20px' }}>FLOW</div>
        </div>
        <div style={{ width: '100%', height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={energyTrend}>
              <defs>
                <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c8a96e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#c8a96e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="energy" stroke="#c8a96e" strokeWidth={3} fillOpacity={1} fill="url(#colorEnergy)" dot={{ r: 4, fill: '#c8a96e', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Radar Chart & Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '28px', padding: '28px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Target size={20} color="#c8a96e" />
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>운세 밸런스</span>
          </div>
          <div style={{ width: '100%', height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                <Radar
                  name="Luck"
                  dataKey="A"
                  stroke="#c8a96e"
                  fill="#c8a96e"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '28px', padding: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Palette size={16} color="#c8a96e" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>행운 컬러</span>
            </div>
            <div style={{ width: '100%', height: '100px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={colorMap} innerRadius={25} outerRadius={40} paddingAngle={5} dataKey="count">
                    {colorMap.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '28px', padding: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Star size={16} color="#c8a96e" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>활동 요약</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: '데일리', count: history.filter(h => h.type === 'DAILY').length },
                { label: '비전', count: history.filter(h => h.type === 'VISION').length },
                { label: '전체', count: history.length },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{item.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#c8a96e' }}>{item.count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Insight Summary */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ padding: '24px', borderRadius: '24px', background: 'rgba(200,169,110,0.05)', border: '1px solid rgba(200,169,110,0.2)', textAlign: 'center' }}
      >
        <div style={{ fontSize: '13px', color: '#c8a96e', lineHeight: 1.6 }}>
          "당신의 데이터는 긍정적인 변화를 가리키고 있어요.<br/>루시와 함께 더 깊은 통찰을 발견해보세요."
        </div>
      </motion.div>
    </div>
  );
}
