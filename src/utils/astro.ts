import { SIGNS, SEMOJI, CITIES } from '../constants';

export function toSign(d: number){const n=((d%360)+360)%360;return SIGNS[Math.floor(n/30)];}
export function toJD(y: number, m: number, d: number, h: number){const a=Math.floor((14-m)/12),yr=y+4800-a,mo=m+12*a-3;return d+Math.floor((153*mo+2)/5)+365*yr+Math.floor(yr/4)-Math.floor(yr/100)+Math.floor(yr/400)-32045-0.5+h/24;}
export function sunL(jd: number){const T=(jd-2451545)/36525,L0=280.46646+36000.76983*T,M=(357.52911+35999.05029*T)*Math.PI/180,C=(1.914602-0.004817*T)*Math.sin(M)+(0.019993-0.000101*T)*Math.sin(2*M);return((L0+C)%360+360)%360;}
export function planL(jd: number, p: string){const T=(jd-2451545)/36525,ps: Record<string, [number, number]>={moon:[218.3165,481267.88],mercury:[252.25,149472.67],venus:[181.98,58517.82],mars:[355.43,19140.30],jupiter:[34.35,3034.91],saturn:[50.08,1222.11]};if(!ps[p])return 0;return((ps[p][0]+ps[p][1]*T)%360+360)%360;}

export function calcAstro(y: number, m: number, d: number, h: number, city: string = '서울') {
  const [lat,lon,tz]=Object.entries(CITIES).find(([k])=>(city||'서울').includes(k))?.[1]||CITIES['서울'];
  const jd=toJD(y,m,d,Math.max(0,h>=0?h-tz:1));
  const fmt=(s: string)=>`${SEMOJI[s as keyof typeof SEMOJI]||''}${s}`;
  const now=new Date(); const jdN=toJD(now.getFullYear(),now.getMonth()+1,now.getDate(),12);
  return `☉태양:${fmt(toSign(sunL(jd)))} ☽달:${fmt(toSign(planL(jd,'moon')))} ↑상승:${h>=0?fmt(toSign(((280.46+360.985*(jd-2451545))%360+lon)%360)):'(시간필요)'}
♂화성:${fmt(toSign(planL(jd,'mars')))} ♀금성:${fmt(toSign(planL(jd,'venus')))} ♃목성:${fmt(toSign(planL(jd,'jupiter')))} ♄토성:${fmt(toSign(planL(jd,'saturn')))}
[트랜짓] 목성:${fmt(toSign(planL(jdN,'jupiter')))} 토성:${fmt(toSign(planL(jdN,'saturn')))}`;
}

export function parseAstro(astro: string) {
  const get = (re: RegExp) => astro.match(re)?.[1] || '';
  return {
    sun: get(/태양:([\S]+)/),
    moon: get(/달:([\S]+)/),
    asc: astro.includes('시간필요') ? '(시간 미입력)' : get(/상승:([\S]+)/),
    mars: get(/화성:([\S]+)/),
    venus: get(/금성:([\S]+)/),
    jupiter: get(/목성:([\S]+)/),
    saturn: get(/토성:([\S]+)/),
    tJupiter: get(/\[트랜짓\] 목성:([\S]+)/),
    tSaturn: get(/\[트랜짓\].*토성:([\S]+)/),
    raw: astro
  };
}
