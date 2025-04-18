"use client"
import { useState, useLayoutEffect, useRef } from "react";
import {
  Network,
  Options,
  Data,
  Edge,
  Node,
  DataSet
} from "vis-network/standalone/esm/vis-network";

// Interface pour les props du hook
export interface UseVisNetworkOptions {
  options: Options;
  nodes: Node[];
  edges: Edge[];
}

// Hook personnalisé
export const useVisNetwork = (props: UseVisNetworkOptions) => {
  const { options } = props;
  const [network, setNetwork] = useState<Network | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  
  // Créer des DataSets pour une meilleure gestion des données
  const nodesDataSet = new DataSet<Node>(props.nodes);
  const edgesDataSet = new DataSet<Edge>(props.edges);
  const data: Data = {
    nodes: nodesDataSet,
    edges: edgesDataSet
  };

  useLayoutEffect(() => {
    if (ref.current) {
      const instance = new Network(ref.current, data, options);
      setNetwork(instance);
    }
    return () => network?.destroy();
  }, []); // Retirer les dépendances nodes et edges

  // Fonction pour ajouter un arc
  const addEdge = (newEdge: Edge) => {
    if (network) {
        if (data.edges instanceof DataSet) {
            data.edges.add(newEdge);
        }
       // Utiliser directement le DataSet
    }
  };

  return {
    network,
    ref,
    addEdge
  };
};
