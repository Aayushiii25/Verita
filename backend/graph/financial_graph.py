import networkx as nx

class FinancialGraph:
    def __init__(self):
        self.graph = nx.MultiDiGraph()

    def add_record(self, record_id, record_type, **attributes):
        self.graph.add_node(
            record_id,
            type=record_type,
            **attributes
        )

    def add_relationship(self, source, target, relationship, confidence=1.0, timestamp=None):
        self.graph.add_edge(
            source,
            target,
            relationship=relationship,
            confidence=confidence,
            timestamp=timestamp
        )

    def get_graph(self):
        nodes = []
        for node, data in self.graph.nodes(data=True):
            nodes.append({
                "id": node,
                **data
            })

        edges = []
        for source, target, data in self.graph.edges(data=True):
            edges.append({
                "source": source,
                "target": target,
                **data
            })

        return {
            "nodes": nodes,
            "edges": edges
        }
