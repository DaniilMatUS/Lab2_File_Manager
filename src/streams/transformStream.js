import { Transform } from 'stream';

export function createTransformStream(transformFunction) {
  let buffer = '';
  
  return new Transform({
    objectMode: false,
    transform(chunk, encoding, callback) {
      try {
        const data = buffer + chunk.toString();
        const lines = data.split('\n');
        
        // Keep the last incomplete line in buffer
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.trim() !== undefined) {
            const result = transformFunction(line);
            if (result !== null && result !== undefined) {
              this.push(result + '\n');
            }
          }
        }
        callback();
      } catch (err) {
        callback(err);
      }
    },
    flush(callback) {
      // Process any remaining data in buffer
      if (buffer.trim()) {
        const result = transformFunction(buffer);
        if (result !== null && result !== undefined) {
          this.push(result + '\n');
        }
      }
      callback();
    }
  });
}
