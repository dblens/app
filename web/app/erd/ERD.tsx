"use-client";
import React from "react";
import dynamic from "next/dynamic";
import {
  DiagramEngine,
  DiagramModel,
  DefaultNodeModel,
  DiagramWidget,
} from "storm-react-diagrams";
import { distributeElements } from "./DagreUtils";

import "./styles.css";

function getDistributedModel(engine, model) {
  const serialized = model.serializeDiagram();
  const distributedSerializedDiagram = distributeElements(serialized);

  //deserialize the model
  let deSerializedModel = new DiagramModel();
  deSerializedModel.deSerializeDiagram(distributedSerializedDiagram, engine);
  return deSerializedModel;
}

function ERD(props) {
  let nodes = []; //Holds Node Models to Pass to Engine
  let links: any[] = []; //Holds Link Models to Pass to Engine
  let tables = {}; //Holds references to tables
  let columns = {}; //Holds references to columns
  let distinctLinks = new Set();

  let schema = props.schema || [];

  if (schema === undefined || schema === 0) {
    return <div>Schema has no tables</div>;
  }

  const getTableKey = (table) => table.table_schema + "." + table.table_name;

  const addTable = (table) => {
    let table_key = getTableKey(table);

    //If table already exists soft alert user
    if (tables.hasOwnProperty(table_key)) {
      console.log(
        `Table ${table.table_schema} + ${table.table_name} already exists.  You likely have duplicate tables`
      );
      return tables[table_key];
    }

    let node = new DefaultNodeModel(table.table_name, "rgb(0,192,255)");
    tables[table_key] = node;

    //Add the Columns for the ports
    table.columns.forEach((col) => {
      let inPort = node.addInPort(col.name);
      let outPort = node.addOutPort(" ");
      columns[table_key + "." + col.name] = {
        inPort,
        outPort,
      };
    });

    return node;
  };

  //1) setup the diagram engine
  var engine = new DiagramEngine();
  engine.installDefaultFactories();

  //2) setup the diagram model
  var model = new DiagramModel();

  //3-A) create a table for each table in schema
  nodes = schema.map((table) => addTable(table));

  //3-B) create links between tables for identified foreign keys
  // If there is a foreign key that references a table+column combination that does not
  // exist we will provide a soft alert and not make the link
  for (let table of schema) {
    for (let fk of table.foreign_keys) {
      let fromTableKey = getTableKey(table);
      let toTableKey = fk.toTableSchema + "." + fk.toTable;
      let fromColumnKey = fromTableKey + "." + fk.fromColumn;
      let toColumnKey = toTableKey + "." + fk.toColumn;
      let portFrom = columns[fromColumnKey];
      let portTo = columns[toColumnKey];
      if (!portFrom) {
        console.log(
          `${fromColumnKey} Column does not exist in schema.  The link from ${fromColumnKey} to ${toColumnKey} will not be added`
        );
        //We will skip this port and continue
        continue;
      }
      if (!portTo) {
        console.log(
          `${toColumnKey} Column does not exist in schema.  The link from ${fromColumnKey} to ${toColumnKey} will not be added`
        );
        //We will skip this port and continue
        continue;
      }

      //test for distinct link before pushing to model links
      if (distinctLinks.has(fromColumnKey + toColumnKey)) {
        console.log(
          `The link between ${fromColumnKey} to ${toColumnKey} has already been added`
        );
        continue;
      }

      //add both from and to and to and from links to distinct links
      distinctLinks.add(fromColumnKey + toColumnKey);
      distinctLinks.add(toColumnKey + fromColumnKey);
      links.push(portFrom.outPort.link(portTo.inPort));
    }
  }

  //4) add the models to the root graph
  model.addAll(...nodes, ...links);

  //5) load model into engine
  let distributedModel = getDistributedModel(engine, model); //distribures model
  engine.setDiagramModel(distributedModel);

  //6) render the diagram!
  return (
    <DiagramWidget
      allowLooseLinks={false}
      allowCanvasTranslation={true}
      allowCanvasZoom={true}
      maxNumberPointsPerLink={0}
      smartRouting={false}
      className="srd-demo-canvas"
      diagramEngine={engine}
    />
  );
}

export default dynamic(() => Promise.resolve(ERD), {
  ssr: false,
});

