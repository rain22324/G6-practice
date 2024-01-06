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
            x: 3,
            y: 0,
            width: w - 19,
            height: h,
            fill: config.bgColor,
            stroke: config.borderColor,
            radius: 2,
            cursor: 'pointer',
          },
          // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
          name: 'rect-shape',
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
    };

    G6.registerNode('card-node', {
      draw: (cfg, group) => {
        const config = getNodeConfig(cfg);
        /* the biggest rect */
        const container = nodeBasicMethod.createNodeBox(group, config, 243, 64);
        
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
            y: 32,
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
      afterDraw: nodeBasicMethod.afterDraw,
      setState: nodeBasicMethod.setState,
    });

    const container = document.getElementById('app');
    const width = container.offsetWidth;
    const height = container.offsetHeight || 500;
    graph = new G6.Graph({
      container: container,
      width,
      height,
      // translate the graph to align the canvas's center, support by v3.5.1
      // fitCenter: true,
      modes: {
        default: ['drag-node'],
      },
      defaultNode: {
        type: 'card-node',
      },
    });

    const data = {
      nodes: [
        {
          id: 'a',
          name: 'cardNodeApp',
          x: 0,
          y: 50,
        },
        {
          id: 'b',
          name: 'cardNodeApp',
          x: 300,
          y: 50,
        },
        {
          id: 'c',
          name: 'cardNodeApp',
          x: 600,
          y: 50,
          children: [
            {
              name: 'sub',
            },
          ],
        },
      ],
      edges: [],
    };

    graph.data(data);
    graph.render();

    if (typeof window !== 'undefined')
      window.onresize = () => {
        if (!graph || graph.get('destroyed')) return;
        if (!container || !container.offsetWidth || !container.offsetHeight) return;
        graph.changeSize(container.offsetWidth, container.offsetHeight);
        graph.render();
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
