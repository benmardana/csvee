import {
  Button,
  Classes,
  Drawer,
  Icon,
  Intent,
  NonIdealState,
  Tree,
  TreeNodeInfo,
} from '@blueprintjs/core';
import React, { useCallback, useEffect, useState } from 'react';
import AddNewTableDialog from './AddNewTableDialog';
import useDB from './DBContext';

type NodePath = number[];

const icon = (
  <Icon
    icon="segmented-control"
    intent={Intent.PRIMARY}
    className={Classes.TREE_NODE_ICON}
  />
);

const transformTablesToNodes = (
  tables: { name: string; columns: string[] }[]
) =>
  tables?.map(({ name, columns }, id) => ({
    id,
    childNodes: columns.map((label, index) => ({
      id: index,
      icon,
      label,
    })),
    label: name,
  }));

const TablesDrawer = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [showAddNewTable, setShowAddNewTable] = useState(false);
  const { tableNames } = useDB();
  const [nodes, setNodes] = useState<TreeNodeInfo[]>([]);

  useEffect(() => {
    tableNames && setNodes(transformTablesToNodes(tableNames));
  }, [tableNames]);

  const handleNodeCollapse = useCallback(
    (_node: TreeNodeInfo, nodePath: NodePath) => {
      const nodesClone = [...(nodes ?? [])].map((i) => ({ ...i }));
      const node = Tree.nodeFromPath(nodePath, nodesClone);
      node.isExpanded = false;
      setNodes(nodesClone);
    },
    [nodes]
  );

  const handleNodeExpand = useCallback(
    (_node: TreeNodeInfo, nodePath: NodePath) => {
      const nodesClone = [...(nodes ?? [])].map((i) => ({ ...i }));
      const node = Tree.nodeFromPath(nodePath, nodesClone);
      node.isExpanded = true;
      setNodes(nodesClone);
    },
    [nodes]
  );

  return (
    <>
      <Drawer
        isOpen={isOpen}
        size={Drawer.SIZE_SMALL}
        title="Tables"
        onClose={onClose}
      >
        {nodes?.length ? (
          <>
            <Tree
              onNodeCollapse={handleNodeCollapse}
              onNodeExpand={handleNodeExpand}
              contents={nodes}
              className={Classes.ELEVATION_0}
            />
            <Button
              icon="add"
              intent={Intent.PRIMARY}
              style={{ margin: '16px' }}
              text="NEW TABLE"
              onClick={() => setShowAddNewTable(true)}
              large
            />
          </>
        ) : (
          <NonIdealState
            icon="search"
            title="No tables found"
            action={
              <Button
                icon="add"
                intent={Intent.PRIMARY}
                text="NEW TABLE"
                onClick={() => setShowAddNewTable(true)}
                large
              />
            }
          />
        )}
      </Drawer>
      <AddNewTableDialog
        isOpen={showAddNewTable}
        onClose={() => setShowAddNewTable(false)}
      />
    </>
  );
};

export default TablesDrawer;
