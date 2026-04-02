import { NodeProps } from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';
import { RoadmapNodeCard } from '../RoadmapNodeCard';

export default function RoadmapCustomNode({ data }: NodeProps) {
  return (
    <>
      <Handle type="target" position={Position.Top} isConnectable={false}/>
      <RoadmapNodeCard
        title={data.label as string}
        progress={data.progress as number ?? 0}
        isComplete={data.isComplete as boolean ?? false}
        onClick={data.onClick as () => void ?? (() => {})}
      />
      <Handle type="source" position={Position.Bottom} isConnectable={false} />
    </>
  );
}