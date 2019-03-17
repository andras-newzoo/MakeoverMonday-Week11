

const createUpdateGridlines = (
  gridline, gridlineCall, color, strokeWidth
) => {

  gridline.call(gridlineCall)

  gridline.selectAll('.domain').remove()
  gridline.selectAll('.tick text').remove()
  gridline.selectAll('.tick line').attr('stroke', color).attr('stroke-width', strokeWidth)

},
createUpdateAxes = (
  axis, axisCall
) => {
  axis.call(axisCall).selectAll('.domain').remove()
  axis.selectAll('.tick line').remove()
  axis.selectAll('.domain').remove()
}

export {createUpdateGridlines, createUpdateAxes}
