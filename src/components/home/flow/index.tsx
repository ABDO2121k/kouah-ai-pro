"use client";
import React, { useCallback } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Bot,
  Cable,
  Cloud,
  Earth,
  File,
  Sparkles,
  SquareFunction,
  Webhook,
} from "lucide-react";
import { Button } from "@/components/ui/moving-border";
import { Connection } from "@xyflow/react";

const initialNodes = [
  {
    id: "h1",
    type: "custom",
    position: { x: 0, y: 0 },
    data: {
      icon: <Cloud />,
      title: "Web",
      subline: "Web crawler",
    },
  },
  {
    id: "h2",
    type: "custom",
    position: { x: 250, y: 0 },
    data: {
      icon: <Bot />,
      title: "Bundle",
      subline: "Static contents",
    },
  },
  {
    id: "h3",
    type: "custom",
    position: { x: 0, y: 250 },
    data: {
      icon: <File />,
      title: "File",
      subline: "Parse PDF, DOCX..",
    },
  },
  {
    id: "h4",
    type: "custom",
    position: { x: 250, y: 250 },
    data: {
      icon: <Webhook />,
      title: "Bundle",
      subline: "Doc contents",
    },
  },
  {
    id: "h5",
    type: "custom",
    position: { x: 472, y: 123 },
    data: {
      icon: <SquareFunction />,
      title: "Generate",
      subline: "Your own bot",
    },
  },
  {
    id: "h6",
    type: "custom",
    position: { x: 824, y: -10 },
    data: {
      icon: <Cable />,
      title: "Integration",
      subline: "Put script on your site",
      slot: (
        <pre className="mt-2 rounded border border-white/60 px-2">
          <code className="text-xs">
            {` <script type="module">
              import { KouahAiBotEmbedd } from "https://cdn.jsdelivr.net/npm/@kouahai/frame@2.0.11";
              KouahAiBotEmbedd("your chatbotId");
            </script>
         `}
          </code>
        </pre>
      ),
    },
  },
  {
    id: "h7",
    type: "custom",
    position: { x: 800, y: 500 },
    data: {
      icon: <Earth />,
      title: "API",
      subline: "REST, GraphQL",
    },
  },
];

const initialEdges = [
  { id: "e1-2", source: "h1", target: "h2" },
  { id: "e3-4", source: "h3", target: "h4" },
  { id: "e2-5", source: "h2", target: "h5" },
  { id: "e4-5", source: "h4", target: "h5" },
  { id: "e5-6", source: "h5", target: "h6" },
  { id: "e5-7", source: "h5", target: "h7" },
];

const CustomNode = ({
  data,
}: {
  data: {
    icon: JSX.Element;
    title: string;
    subline: string;
    slot?: JSX.Element;
  };
}) => (
  <div className="custom-node bg-black text-white p-5 rounded-lg border-2 border-sky-500 shadow-md shadow-sky-300">
    <Handle
      type="target"
      position={Position.Left}
      style={{ background: "#555" }}
      onConnect={(params) => console.log("handle onConnect", params)}
    />
    <div className="icon">{data.icon}</div>
    <div className="title">{data.title}</div>
    <div className="subline">{data.subline}</div>
    {data.slot && <div className="slot">{data.slot}</div>}
    <Handle
      type="source"
      position={Position.Right}
      id="a"
      style={{ top: "50%", background: "#555" }}
    />
  </div>
);

const nodeTypes = {
  custom: CustomNode,
};

const Flow = () => {
  // eslint-disable-next-line
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        id: `${params.source}-${params.target}`,
        source: params.source,
        target: params.target,
        style: { stroke: "#000", strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );
  return (
    <div className="mt-10">
      <div className="flex items-center justify-center gap-5 flex-col">
        <Button
          borderRadius="1.75rem"
          className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800 flex gap-2 text-lg"
        >
          <Sparkles /> WORKFLOW
        </Button>
        <h1 className="max-w-4xl text-5xl md:text-6xl lg:text-7xl font-extrabold text-center">
          How <span className="text-[#06b6d4]">KouahChat</span> Works
        </h1>
      </div>
      <div
        className="w-[80%] bg-transparent border border-black mx-auto  sm:px-15 rounded-lg px-10 mt-14"
        style={{ height: "500px" }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default Flow;
