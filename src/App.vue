<template>
  <div id="app"></div>
</template>

<script>
import G6 from '@antv/g6';

export default {
  name: 'App',
  components: {},
  mounted() {
    let graph;

    const getNodeConfig = (node) => {
      let config = {
        basicColor: '#5B8FF9',
        fontColor: '#5B8FF9',
        borderColor: '#5B8FF9',
        bgColor: '#C6E5FF',
      };
      
      return config;
    };

    const nodeBasicMethod = {
      createNodeBox: (group, config, w, h) => {
        /* 最外面的大矩形 */
        const container = group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: w,
            height: h,
          },
          // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
          name: 'big-rect-shape',
        });
        
        /* 矩形 */
        group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: w,
            height: h,
            fill: config.bgColor,
            stroke: config.borderColor,
            lineWidth: 2,
            radius: 8,
            cursor: 'pointer',
          },
          // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
          name: 'rect-shape',
        });

        return container;
      }
    };

    G6.registerNode('card-node', {
      draw: (cfg, group) => {
        const config = getNodeConfig(cfg);
        /* the biggest rect */
        const container = nodeBasicMethod.createNodeBox(group, config, 250, 50);
        
        group.addShape('image', {
          attrs: {
            x: 20,
            y: 13,
            height: 12,
            width: 10,
            img: 'https://os.alipayobjects.com/rmsportal/DFhnQEhHyPjSGYW.png',
            cursor: 'pointer',
            opacity: 0,
          },
          // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
          name: 'ip-cp-icon',
        });

        /* name */
        group.addShape('text', {
          attrs: {
            text: cfg.name,
            x: 120,
            y: 25,
            fontSize: 14,
            fontWeight: 700,
            textAlign: 'center',
            textBaseline: 'middle',
            fill: config.fontColor,
          },
          // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
          name: 'name-text-shape',
          capture: false
        });

        return container;
      },
      afterDraw: (cfg, group) => {
        /* 操作 marker 的背景色显示隐藏 */
        const item = group.find((element) => element.get('name') === 'rect-shape');
        if (item) {
          item.on('click', () => {
              const ipIcon = group.find((element) => element.get('name') === 'ip-cp-icon');
              const onSelect = () => {
                ipIcon.attr('opacity', 1);
                graph.get('canvas').draw();
              };
              const onCancelSelect = () => {
                ipIcon.attr('opacity', 0);
                graph.get('canvas').draw();
              };
              if(ipIcon.attrs.opacity === 1) {
                onCancelSelect();
              }else {
                onSelect();
              }
          })
        }
      },
      setState: (name, value, item) => {
        const hasOpacityClass = [
          'ip-cp-icon',
        ];
        const group = item.getContainer();
        const childrens = group.get('children');
        graph.setAutoPaint(false);
        if (name === 'emptiness') {
          if (value) {
            childrens.forEach((shape) => {
              if (hasOpacityClass.indexOf(shape.get('name')) > -1) {
                return;
              }
              shape.attr('opacity', 0.4);
            });
          } else {
            childrens.forEach((shape) => {
              if (hasOpacityClass.indexOf(shape.get('name')) > -1) {
                return;
              }
              shape.attr('opacity', 1);
            });
          }
        }
        graph.setAutoPaint(true);
      },
    });

    const container = document.getElementById('app');
    const width = container.offsetWidth;
    const height = container.offsetHeight || 500;
    const G6Config = {
      container: container,
      width,
      height,
      modes: {
        default: [
          {
            type: 'scroll-canvas',
            direction: 'y',
            scalableRange: -70,
            allowDragOnItem: true,
          },
        ],
      },
      layout: {
        type: 'dagre',
        rankdir: 'LR',
        align: 'UL',
        controlPoints: true,
        nodesep: 10, // 可选
        ranksep: (width-1000)/13, // 可选
        // nodesepFunc: () => 10,
        // ranksepFunc: () => 1,
      },
      defaultNode: {
        type: 'card-node',
        size: [250, 50],
        anchorPoints: [
          [1, 0.5],
          [0, 0.5],
        ],
      },
      defaultEdge: {
        type: 'cubic-horizontal',
        size: 8,
        color: 'l(0) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
        style: {
          // endArrow: {
          //   path: 'M 0,0 L 8,4 L 8,-4 Z',
          //   fill: '#e2e2e2',
          // },
          radius: 20,
        }
      },
    }

    graph = new G6.Graph(G6Config);

    const data = {
      nodes: [
        {
          id: 'a',
          name: 'cardNodeAppa',
        },
        {
          id: 'b',
          name: 'cardNodeAppb',
        },
        {
          id: 'c',
          name: 'cardNodeAppc',
        },
        {
          id: 'd',
          name: 'cardNodeAppd',
        },
        {
          id: 'e',
          name: 'cardNodeAppe',
        }
      ],
      edges: [
        {
          source: 'a',
          target: 'b',
        },
        {
          source: 'b',
          target: 'c',
        },
        {
          source: 'c',
          target: 'd'
        },
        {
          source: 'c',
          target: 'e'
        }
      ],
    };

    graph.data(data);
    graph.render();

    if (typeof window !== 'undefined')
      window.onresize = () => {
        if (!graph || graph.get('destroyed')) return;
        if (!container || !container.offsetWidth || !container.offsetHeight) return;
        graph.changeSize(container.offsetWidth, container.offsetHeight);
      };
  }
}
</script>

<style lang="less">
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
}
#app {
  color: red;
  font-size: 16px;
  width: 100%;
  height: 100%;
}
</style>
