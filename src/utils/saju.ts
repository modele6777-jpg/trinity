import { HS, EB, DM, EL } from '../constants';

export function calcSaju(y: number, m: number, d: number, h: number, gender: string) {
  const yi=(y-4)%60;
  const yp={gan:HS[yi%10],zhi:EB[yi%12]};
  const mgi=([2,4,6,8,0][Math.floor(((y-4)%60)%10/2)]*2+(m-1))%10;
  const mp={gan:HS[mgi],zhi:EB[(m+1)%12]};
  const a=Math.floor((14-m)/12),yr=y-a,mo=m+12*a-2;
  const jd=d+Math.floor((153*mo+2)/5)+365*yr+Math.floor(yr/4)-Math.floor(yr/100)+Math.floor(yr/400)-32045;
  const di=(jd+49)%60;
  const dp={gan:HS[di%10],zhi:EB[di%12]};
  const hp=h>=0?{gan:HS[(HS.indexOf(dp.gan)*2+Math.floor((h+1)/2)%12)%10],zhi:EB[Math.floor((h+1)/2)%12]}:null;

  const ec: Record<string, number> = {木:0,火:0,土:0,金:0,水:0};
  [yp,mp,dp,hp].forEach(p=>{if(p){if(EL[p.gan as keyof typeof EL])ec[EL[p.gan as keyof typeof EL]]++;if(EL[p.zhi as keyof typeof EL])ec[EL[p.zhi as keyof typeof EL]]++;}});
  const sorted=Object.entries(ec).sort((a,b)=>b[1]-a[1]);

  const isYang=HS.indexOf(yp.gan)%2===0;
  const isFwd=(isYang&&gender==='남')||(!isYang&&gender==='여');
  const mgi2=HS.indexOf(mp.gan), mzi=EB.indexOf(mp.zhi);
  const now=new Date().getFullYear();
  const daeuns=Array.from({length:8},(_,i)=>i+1).map(i=>({
    ganZhi:HS[((mgi2+(isFwd?i:-i))%10+10)%10]+EB[((mzi+(isFwd?i:-i))%12+12)%12],
    startAge:i*10-9, startYear:y+i*10-9,
  }));
  const curD=daeuns.find(d=>d.startYear<=now&&d.startYear+10>now);
  const nextD=daeuns.find(d=>d.startYear>now);

  const elNames: Record<string, string> ={'木':'목(나무)','火':'화(불)','土':'토(흙)','金':'금(쇠)','水':'수(물)'};
  const koreanAge = now - y + 1;
  
  return `[사주] 년:${yp.gan+yp.zhi} 월:${mp.gan+mp.zhi} 일:${dp.gan+dp.zhi}${hp?' 시:'+hp.gan+hp.zhi:''}
[일간] ${DM[dp.gan as keyof typeof DM]||dp.gan} (현재 ${koreanAge}세)
[오행] 강함:${elNames[sorted[0][0]]}(${sorted[0][1]}개) 부족:${elNames[sorted[sorted.length-1][0]]}(${sorted[sorted.length-1][1]}개)
[대운] 현재:${curD?curD.ganZhi+'운 ('+curD.startAge+'세~'+(curD.startAge+9)+'세)':''}${nextD?' → 다음:'+nextD.ganZhi+'운 ('+nextD.startAge+'세~)':''}`;
}
