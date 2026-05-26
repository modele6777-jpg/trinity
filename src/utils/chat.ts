export function parseChat(text: string, defaultSender: string = 'Lucy') {
  if(!text?.trim()) return { messages: [], emotion: undefined };

  const sender = 'Lucy';
  
  // 감정 태그 추출 ([EMOTION: 감정이름])
  let emotion: string | undefined;
  const emotionMatch = text.match(/\[EMOTION:\s*([^\]]+)\]/i);
  if (emotionMatch) {
    emotion = emotionMatch[1].trim();
  }

  // [Lucy]: 또는 Lucy: 패턴 및 감정 태그 정리
  const cleanText = text
    .replace(/\[EMOTION:\s*[^\]]+\]/gi, '')
    .replace(/\[(Lucy|Trinity|루시|트리니티)\]:?\s*/gi, '')
    .replace(/(Lucy|Trinity|루시|트리니티):\s*/gi, '');

  const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);
  const blocks: { sender: string; text: string }[] = [];
  for(const line of lines) {
    const m = line.match(/^\[(Lucy|Trinity|루시|트리니티)\]:\s*(.+)/) || line.match(/^(Lucy|Trinity|루시|트리니티):\s+(.+)/);
    if(m) {
      blocks.push({ sender: 'Lucy', text: m[2] });
    }
    else if(blocks.length > 0) blocks[blocks.length-1].text += ' ' + line;
  }
  if(blocks.length === 0) blocks.push({ sender, text: cleanText.trim() });

  const result: { sender: string; text: string }[] = [];
  for(const block of blocks) {
    const t = block.text.trim();
    const parts: string[] = [];
    let current = '';
    for(let i = 0; i < t.length; i++) {
      current += t[i];
      if('.!?~'.includes(t[i]) && i < t.length-1 && t[i+1] === ' ') {
        parts.push(current.trim());
        current = '';
        i++; 
      }
    }
    if(current.trim()) parts.push(current.trim());

    if(parts.length <= 2) {
      result.push({ sender: block.sender, text: t });
    } else {
      for(let i = 0; i < parts.length; i += 2) {
        const chunk = parts.slice(i, i+2).join(' ');
        if(chunk.trim()) result.push({ sender: block.sender, text: chunk });
      }
    }
  }
  return { messages: result, emotion };
}
