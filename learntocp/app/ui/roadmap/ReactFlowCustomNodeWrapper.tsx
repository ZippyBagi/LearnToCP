import { NodeProps } from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';
import { RoadmapNodeCard } from './customNodes/RoadmapNodeCard';
import { ConnectorNode } from './customNodes/RoadmapConncetorNodeCard'

export function RoadmapCustomNode({ data }: NodeProps) {
  return (
    <>
      {data.hideTopNode === false? <Handle type="target" position={Position.Top} isConnectable={false} style={{ opacity: 0 }}/> : '' }
      <RoadmapNodeCard
        title={data.label as string}
        progress={data.progress as number ?? 1}
        isComplete={data.isComplete as boolean ?? false}
        onClick={data.onClick as () => void ?? (() => {})}
      />
      {data.hideBottomNode === false? <Handle type="source" position={Position.Bottom} isConnectable={false} style={{ opacity: 0 }}/> : ''}
    </>
  );
}

export function RoadmapConnectorNode({data} : NodeProps){
  return (
    <>
      {data.hideTopNode === false? <Handle type="target" position={Position.Top} isConnectable={false} style={{ opacity: 0 }}/> : ''}
      <ConnectorNode
        
      />
      {data.hideBottomNode === false? <Handle type="source" position={Position.Bottom} isConnectable={false} style={{ opacity: 0 }}/> : ''}
    </>
  );
}