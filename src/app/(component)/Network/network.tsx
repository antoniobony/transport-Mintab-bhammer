"use client";
import React, { useEffect, useState } from "react";
import { Options, Edge, Node } from "vis-network/standalone/esm/vis-network";
import useVisNetwork from "@/app/vis";
import { arbre } from "@/app/romodif/page";
import { nodeType } from "./NetworkType";
import { color } from "framer-motion";

export default function Network({ networkData }: { networkData: arbre[] }) {
  const [edgeState, setEdgeState] = useState<Edge[]>([]);
  const [nodes, setNodes] = useState<nodeType[]>([]);
  const [optionsState, setOptionState] = useState<Options>({});

  const { ref, network } = useVisNetwork({
    options: optionsState,
    edges: edgeState,
    nodes,
  });

  const handleClick = () => {
    if (!network) return;
    network.focus(5);
  };

  const setNetworkData = (networkData: arbre[]) => {
    const alphabet = ["A", "B", "C", "D"];
    const nodeList: nodeType[] = [];
    const edges: Edge[] = [];

    // Traitement des nœuds de départ
    networkData
      .sort((a, b) => {
        const aIndex = alphabet.findIndex((e) => e === a.sommetDebut.designation);
        const bIndex = alphabet.findIndex((e) => e === b.sommetDebut.designation);
        return aIndex - bIndex;
      })
      .forEach((value, index) => {
        if (!nodeList.some((n) => n.label === value.sommetDebut.designation)) {
          nodeList.push({
            id: nodeList.length,
            label: value.sommetDebut.designation,
            otherLabel: value.sommetDebut.value.toString(),
            title: value.sommetDebut.designation,
            group: "struct",
            x: -70,
            y: nodeList.length * 50 - 100,
          });
        }
      });

    // Traitement des nœuds de fin
    let i=0;
    networkData
      .sort((a, b) => {
        const aIndex = parseInt(a.sommetFin.designation);
        const bIndex = parseInt(b.sommetFin.designation);
        return aIndex - bIndex;
      })
      .forEach((value, index) => {
        if (!nodeList.some((n) => n.label === value.sommetFin.designation)) {
          nodeList.push({
            id: nodeList.length,
            label: value.sommetFin.designation,
            otherLabel: value.sommetFin.value.toString(),
            title: value.sommetFin.designation,
            group: "struct",
            x: 200,
            y: (nodeList.length - (nodeList.length - i ))* 50 - 125,
          });
          i++;
        }
      });

    // Création des arêtes en utilisant les ID des nœuds
    networkData.forEach((value) => {
      const fromNode = nodeList.find((n) => n.label === value.sommetDebut.designation);
      const toNode = nodeList.find((n) => n.label === value.sommetFin.designation);
      if (fromNode && toNode) {
        edges.push({
          from: fromNode.id,
          to: toNode.id,
          label: value.arc.toString(),
          color: value.isDegenerate !== undefined ? "#1063cf" : "#000000"
        });
      }
    });

    const options = {
      nodes: {
        shape: "custom",
        physics: false,
        ctxRenderer: ({
          ctx,
          id,
          x,
          y,
          state: { selected, hover },
          label,
        }: {
          ctx: CanvasRenderingContext2D;
          id: number;
          x: number;
          y: number;
          state: { selected: boolean; hover: boolean };
          label: string;
        }) => {
          const node = nodeList.find((n) => n.id === id);
          const otherLabel = node?.otherLabel || "";

          const radius = 20;
          ctx.fillStyle = "#80deea";
          ctx.strokeStyle = "rgb(30, 147, 214)";
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();

          ctx.font = "16px Arial";
          ctx.fillStyle = "#000000";
          ctx.textAlign = "center";
          ctx.fillText(label, x, y + 5);

          ctx.font = "16px Arial";
          ctx.fillStyle = "#666666";
          ctx.fillText(otherLabel, x === -70 ? x - 70 : x + 70, y - 30 + radius + 15);

          return { box: { x, y, w: radius * 2, h: radius * 2 } };
        },
      },
    };
    console.log(nodeList);
    setEdgeState(edges);
    setNodes(nodeList);
    setOptionState(options);
  };

  // Dépend uniquement de networkData, pas de network
  useEffect(() => {
    if (networkData) {
      setNetworkData(networkData);
    }
  }, [networkData]);

  return (
    <>
      <div  style={{ height: 610, width: "67%" }} ref={ref} />
    </>
  );
}