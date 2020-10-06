import React from 'react';
import createReactClass from 'create-react-class';

class Datatable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      "data": this.props.initialData,
      "sortBy": null,   // schema.id
      "descending": false,
      "editMarker": null,  // [row index, schema.id]
      "searchDisplayed": false,
      "dialog": null, // [type, index]
    };
    this.originalData = null;
    this.actionLog = [];
  }

  componentDidMount() {
    document.onkeydown = function(e) {
      if (e.altKey && e.shiftKey && e.keyCode === 82) {
        this.replay();
      }
    }.bind(this);
  }

  // TODO: need bypass for replay to avoid constantly growing state log
  componentDidUpdate(props, state) {
//    const item = (this.actionLog.length === 0) ? this.state : state;
//    this.actionLog.push(JSON.parse(JSON.stringify(item)));
  }

/*
  "propTypes": {
    "headers": PropTypes.arrayOf(PropTypes.string),
    "initialData": PropTypes.arrayOf(PropTypes.shape({
      "mission": PropTypes.string.isRequired,
      "shuttle": PropTypes.string.isRequired,
      "date": PropTypes.string.isRequired
    }))
  },
*/

  _fireDataChange(data) {
    this.props.onDataChange(data);
  }

  /**
   *
   * Replay Functionality
   *
   **/

  // TODO: look at this for undo/redo
  // TODO: hook this into componentDidUpdate, but bypass
  //   adding to the state on replay (which uses setState())
  logThenSetState(state) {
    const item = (this.actionLog.length === 0) ? this.state : state;
    this.actionLog.push(JSON.parse(JSON.stringify(item)));
    this.setState(state);
  }

  replay() {
    if (this.actionLog.length === 0) {
      console.warn(`Trying to replay an empty action log.`);
      return;
    }
    let i = -1;
    const interval = setInterval(function() {
      i += 1;
      if (i === this.actionLog.length - 1) {
        clearInterval(interval);
      }
      this.setState(this.actionLog[i]);
    }.bind(this), 1000);
  }

  /**
   *
   * Sort Functionality
   *
   **/

  sort(e) {
    const column = e.target.dataset.column;
    const desc = (this.state.sortBy === column) ? !this.state.descending : false;
    let missions = Array.from(this.state.data);
    missions.sort(function(a,b) {
      if (desc === false) {
        return (a[column] > b[column]) ? 1 : -1;
      } else {
        return (a[column] < b[column]) ? 1 : -1;
      }
    });
    this.setState({ "data": missions, "descending": desc, "sortBy": column });
    this._fireDataChange(missions);
  }

  /**
   *
   * Table edit functionality
   *   (that we're not using)
   *
   **/
/*
  editable(e) {
    const row = e.target.closest('tr').rowIndex - 1;
    const column = e.target.cellIndex;
    // not using dataset.column at the end to minimize confusion between the key and the var
    const key = document.querySelectorAll('table tr th')[column].dataset["column"];

    this.setState({ "editMarker": { "row": row, "column": column, "key": key }});
  }

  updateTable(e) {
    e.preventDefault();

    let data = Array.from(this.state.data);
    // SUGGESTED: const newVal = this.refs.input.getValue();
    const newVal = e.target.querySelector('input').value;

    data[this.state.editMarker.row][this.state.editMarker.key] = newVal;
    this.setState({ "data": data, "editMarker": null });
    this._fireDataChange(data);
  }
*/

  /**
   *
   * Filter Functionality
   *
   **/

  // TODO: handle multicolumn filtering
  filterData(e) {
    const needle = e.target.value.toLowerCase();
    if (needle.length === 0) {
      this.setState({ "data": this.originalData });
      return;
    }

    const key = e.target.dataset["index"];

    const results = this.originalData.filter(function(mission) {
      return mission[key].toString().toLowerCase().includes(needle);
    });

    this.setState({ "data": results });
  }

  showFilter() {
    if (this.state.searchDisplayed === false) {
      return null;
    }

    return (
      <tr onChange={this.filterData.bind(this)}>{this.props.headers.map((heading, i) =>
        <td key={i}><input type="text" data-index={heading}/></td>
      )}</tr>
    );
  }

  toggleFilter() {
    if (this.state.searchDisplayed === true) {
      this.setState({ "data": this.originalData, "searchDisplayed": false });
      this.originalData = null;
    } else {
      this.originalData = this.state.data;
      this.setState({ "searchDisplayed": true });
    }
  }

  /**
   *
   * Table edit functionality
   *   (that we're not using)
   *
   **/
  download(format, e) {
    let data = '';
    if (format === 'json') data = JSON.stringify(this.state.data);
    if (format === 'csv') {
      // TODO
    }
    const URL = window.URL || window.webkitURL;
    const blob = new Blob([data], { "type": `text/${format}` });
    e.target.href = URL.createObjectURL(blob);
    e.target.download = `data.${format}`;
  }

  render() {
    return (
      <div className="Datatable">
        <div>
          <button onClick={this.toggleFilter.bind(this)} className="toolbar">Search</button>
          <a onClick={this.download.bind(this, 'json')} className="toolbar">Export JSON</a>
          <a onClick={this.download.bind(this, 'csv')} className="toolbar">Export CSV</a>
        </div>
        <table>
          <thead onClick={this.sort.bind(this)}>
            <tr>{this.props.headers.map(function(heading, i) {
            let sortDir = '\u2195';  // updown by default
            if (heading === this.state.sortBy) {
              if (this.state.descending === false) { sortDir = "\u2193"; }
              else { sortDir = "\u2191"; }
            }
            return <th key={i} data-column={heading}>{heading}{sortDir}</th>;
            }, this)}</tr>
          </thead>
          <tbody>{/*onDoubleClick={this.editable}*/}
          {this.showFilter()}
          {this.state.data.map(function(row, i) {
            /* editable stuff we don't care about right now
            if ((this.state.editMarker !== null) && (this.state.editMarker.row === i)) {
              let editField = React.createElement("form", { "onSubmit": this.updateTable },
                React.createElement("input", { "type": "text", "defaultValue": row[this.state.editMarker.key], "placeholder": row[this.state.editMarker.key] })
              );
              row[this.state.editMarker.key] = editField;
            }  */
            return <tr key={i}><td>{row.mission}</td><td>{row.shuttle}</td><td>{row.date}</td></tr>;
          }, this)}
          </tbody>
        </table>
      </div>
    );
  }

}

export default Datatable;