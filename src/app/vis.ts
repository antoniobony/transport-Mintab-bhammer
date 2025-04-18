import { useState, useLayoutEffect, useRef } from "react";
import {
  Network,
  Options,
  Data,
  Edge,
  Node
} from "vis-network/standalone/esm/vis-network";

export interface UseVisNetworkOptions {
  options: Options;
  nodes: Node[];
  edges: Edge[];
}

export default function useVisNetwork({ edges, nodes, options }: UseVisNetworkOptions) {
  const [network, setNetwork] = useState<Network | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const data: Data = { nodes, edges };

  useLayoutEffect(() => {
    if (ref.current) {
      const instance = new Network(ref.current, data, options);
      setNetwork(instance);
    }

    // Fonction de nettoyage pour détruire l'instance réseau lors du démontage
    return () => {
      if (network) {
        network.destroy();
      }
    };
  }, []); // Ne s'exécute qu'au montage

  // Met à jour le réseau lorsque les données ou les options changent
  useLayoutEffect(() => {
    if (network) {
      network.setData(data);
      network.setOptions(options);
    }
  }, [network, edges, nodes, options]); // S'exécute à nouveau lorsque ces dépendances changent

  return { network, ref };
}