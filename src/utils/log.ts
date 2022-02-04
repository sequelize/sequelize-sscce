import NodeUtil from 'util';

export function log(...args: any[]): void {
  console.log.apply(console, args.map(arg => {
    return NodeUtil.inspect(arg);
  }));
}
