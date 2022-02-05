import * as dagre from "dagre";
import * as _ from "lodash";

const MIN_HEIGHT = 60; //min node height
const MIN_WIDTH = 60; //min node width
const HEIGHT_ADJUST = 15; //Should be t he height of ports
const WIDTH_ADJUST = 10; //Should be the expected width of a cahr

export function distributeElements(model) {
  let clonedModel = _.cloneDeep(model);
  let nodes = distributeGraph(clonedModel);
  nodes.forEach(node => {
    let modelNode = clonedModel.nodes.find(item => item.id === node.id);
    modelNode.x = node.x - node.width / 2;
    modelNode.y = node.y - node.height / 2;
  });
  return clonedModel;
}

function distributeGraph(model) {
  let nodes = mapElements(model);
  let edges = mapEdges(model);
  let graph = new dagre.graphlib.Graph();
  graph.setGraph({});
  graph.setDefaultEdgeLabel(() => ({}));
  //add elements to dagre graph
  nodes.forEach(node => {
    graph.setNode(node.id, node.metadata);
  });
  edges.forEach(edge => {
    if (edge.from && edge.to) {
      graph.setEdge(edge.from, edge.to);
    }
  });
  //auto-distribute
  dagre.layout(graph);
  return graph.nodes().map(node => graph.node(node));
}

function mapElements(model) {
  // dagre compatible format
  return model.nodes.map(node => {
    // adjust width and height so dagre can align correctly
    let height_adjust = node.ports.length
      ? node.ports.length * HEIGHT_ADJUST
      : 0;
    let portNames = node.ports.map(p => p.label);
    let longestName = [node.name, ...portNames].reduce((a, b) =>
      a.length > b.length ? a : b
    );
    let width_adjust = longestName.length
      ? longestName.length * WIDTH_ADJUST
      : 0;
    let height = height_adjust < MIN_HEIGHT ? MIN_HEIGHT : height_adjust;
    let width = width_adjust < MIN_WIDTH ? MIN_WIDTH : width_adjust;
    return {
      id: node.id,
      metadata: { height, width, id: node.id }
    };
  });
}

function mapEdges(model) {
  // returns links which connects nodes
  // we check are there both from and to nodes in the model. Sometimes links can be detached
  return model.links
    .map(link => ({
      from: link.source,
      to: link.target
    }))
    .filter(
      item =>
        model.nodes.find(node => node.id === item.from) &&
        model.nodes.find(node => node.id === item.to)
    );
}
