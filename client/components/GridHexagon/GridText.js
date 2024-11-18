import React, { Component } from 'react';
import PropTypes from 'prop-types';

// TODO Text is a separate component so that it could wrap the given text inside the surrounding hexagon
class GridText extends Component {
  static propTypes = {
    children: PropTypes.string,
    x: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    y: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    className: PropTypes.string

  };

  render() {
    const { children, x, y, className } = this.props;
    if (children.length < 18) return (
        <text  x={x || 0} y={y ? y : '0.3em'} className={className} textAnchor="middle">
            {children}
       </text>
      )
    else {
        const splitted_string = []
        let remaining_string = children.length > 30 ? children.slice(0, 27) + '...' : children
        /*if (remaining_string.includes(': ') && remaining_string.length >= 18){
            const temp = remaining_string.split(': ')
            splited_string.push(temp[0] + ':')
            remaining_string = temp.slice(1, temp.length ).join(' ')
        }*/
        while((remaining_string.includes(' ') || remaining_string.includes('\n')) && remaining_string.length >= 18){
            const temp = remaining_string.split(/['\s', '\n']/).map(string => string.trim()).filter(string => string.length > 0)
            if (temp[0].length < 3  ) {
                splitted_string.push(temp.slice(0, 2).join(' '))
                remaining_string = temp.slice(2, temp.length).join(' ')
            }
            else {
                splitted_string.push(temp[0])
                remaining_string = temp.slice(1, temp.length ).join(' ')
            }
        }
        splitted_string.push(remaining_string)

        return (
            <text  x="0" y="0" className={className} textAnchor="middle">
                {
                    (splitted_string.length == 2) && 
                    (<tspan x={x || 0} dy="-0.3em">{splitted_string[0]}</tspan>) ||
                    (splitted_string.length == 3) && 
                    (<tspan x={x || 0} dy="-0.6em">{splitted_string[0]}</tspan>) ||
                    (<tspan x={x || 0} dy="-1.2em">{splitted_string[0]}</tspan>)
                }
                {
                    splitted_string.slice(1, splitted_string.length).map(string => (
                        <tspan x={x || 0} dy="1.2em">{string}</tspan>
                    ))
                }
           </text>
          );
    }
  }
}

export default GridText;