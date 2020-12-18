export const fishBone = (window, $) => {
    const fishBone = {};
    // 两块的间隙
    fishBone.gapStep = 250;
    // 颜色设定
    fishBone.style = '#038dc5';
    fishBone.option = {};
    fishBone.axisTpl = `<div class="fish-bone-axis"></div>`;
    fishBone.blockTpl = `
      <div class="fish-bone-block">

        <div class="fish-bone-line upper-line"></div>
        <div class="fish-bone-line lower-line"></div>
        <div class="fish-bone-node active-node"></div>
        <div class="fish-bone-content active-content label-content">
          
        </div>
        <div class="fish-bone-content date-conent active-content">
          
        </div>
      </div>
      `;
    // 各元素的位置
    const lineLeft = 209,
        nodeLeft = 200,
        labelContentLeft = 80,
        dateContentLeft = 136,
        upperLineBottom = 200,
        lowerLineTop = 200,
        nodeTop = 195,
        labelContentBottom = 226,
        dateContentTop = 226;
    // 初始化插件
    fishBone.init = function (container, option) {
        this.style = option.color ? option.color : this.style;
        const data = option.data;
        const len = data.length;
        let tpl = '';
        tpl += this.axisTpl;
        for (let i = 0; i < len; i++) {
            tpl += '<div class="fish-bone-block">';
            tpl += '<div class="fish-bone-line upper-line" style="left:' + (lineLeft + this.gapStep * i) + 'px;bottom:' + upperLineBottom + 'px;"></div>';
            tpl += '<div class="fish-bone-line lower-line" style="left:' + (lineLeft + this.gapStep * i) + 'px;top:' + lowerLineTop + 'px;"></div>';
            tpl += '<div class="fish-bone-node" style="top:' + nodeTop + 'px;left:' + (nodeLeft + this.gapStep * i) + 'px;"></div>'

            const pos1 = i % 2 == 0 ? 'top' : 'bottom';
            const pos2 = i % 2 == 0 ? 'bottom' : 'top';

            tpl += '<div class="fish-bone-content label-content" style="left:' + (labelContentLeft + this.gapStep * i) + 'px;' + pos1 + ':' + labelContentBottom + 'px;">';
            tpl += data[i].label;
            tpl += '</div>'
            tpl += '<div class="fish-bone-content date-conent" style="left:' + (dateContentLeft + this.gapStep * i) + 'px;' + pos2 + ':' + dateContentTop + 'px;">';
            tpl += data[i].date;
            tpl += '</div>';
            tpl += '</div>';

        }
        $(container).html(tpl);
        // 增加轴的长度
        const scale = Math.ceil(len / 3);
        $(".fish-bone-axis").css({
            "width": (700 * scale + "px")
        });
        // 设置节点的边框颜色
        const color = this.style;
        $(".fish-bone-node").css({
            "border-color": color
        });
    }
    window.fishBone = fishBone;
}