import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faSave, faDragon } from '@fortawesome/free-solid-svg-icons'

/*
    Styles
*/
const Container = styled.div`
    position: absolute;
    background: orange;
    border: 2px solid green;
    overflow: visible;
    z-index: 1;
`;

const Dot = styled(FontAwesomeIcon)`
    position: absolute;
    font-size: 21px;
    color: #232323;
`;

const Tooltip = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 190px;
    min-height: 90px;
    background: rgba( 0,0,0,0.8 );
    border: 1px solid #333;
    color: rgba(255,255,255,0.9);
    border-radius: 4px;

    .tooltip-content {
        padding: 15px 30px 20px 15px;
    }

    .tooltip-edit, .tooltip-save {
        position: absolute;
        top: 3px;
        right: 5px;
        text-decoration: none;
        cursor: pointer;

        svg {
            font-size: 12px;

            path {
                fill: rgba(255,255,255,0.9);
            }
        }

        &:hover {
            text-decoration: underline;
        }
    }

    // Compensate for SVG icon irregularities
    .tooltip-save svg {
        font-size: 14px;
        top: 6px;
        right: 1px;
    }

    .text-success {
        position: absolute;
        left: 0;
        bottom: 3px;
        width: 100%;
        font-size: 12px;
        color: red;
        text-align: center;
        opacity: 0;
        transition: opacity 0.16s;

        &.show {
            opacity: 1;
            transition: opacity 0.1s;
        }
    }
`;

const Editor = styled.div`
    width: 100%;
    position: relative;
    left: 0;
    top: 0;
    background: transparent;
    border: none;
    color: rgba(255,255,255,0.9);
    border-radius: 3px;
    z-index: 5;
    display: none;
    font-size: 0;

    textarea {
        width: calc(100% - 45px);
        height: calc(100% - 30px);
        padding: 15px 30px 15px 15px;
        font-family: 'Source Sans Pro';
        font-size: 16px;
        color: inherit;
        background: transparent;
        border: none;
        outline: none;
        resize: none;
    }

    .btn {
        width: 100%;
        height: 20px;
        font-size: 16px;
        line-height: 20px;
        text-align: center;
        padding: 3px 0;
        border: none;
        background: #ffffff;
        color: #333333;
        border: none;
        border-bottom-left-radius: 3px;
        border-bottom-right-radius: 3px;
    }

    &.show {
        display: block;
    }
`;

const Icon = styled(FontAwesomeIcon)`
    position: relative;
    top: 0;
`;


/*
    Marker component
*/
class Marker extends React.Component {

    constructor(props) {
        super(props);

        const { position, text, tooltipIsOpen, editorIsOpen } = props;

        this.state = {
            position,
            text,
            tooltipIsOpen: !!tooltipIsOpen,
            editorIsOpen: !!editorIsOpen,
            isSuccess: false
        }

        this.textInput = React.createRef();

        this.editTooltip = this.editTooltip.bind( this );
        this.saveTooltip = this.saveTooltip.bind( this );
        this.enterMarker = this.enterMarker.bind( this );
        this.leaveMarker = this.leaveMarker.bind( this );

    }

    componentDidMount() {
        if ( this.state.editorIsOpen ) {
            this.textInput.current.focus();
        }
    }

    editTooltip( e ) {

        this.setState({
            editorIsOpen: true
        });
    }

    saveTooltip( e ) {

        const text = e.currentTarget.parentElement.childNodes[1].value;

        if ( this.props.onUpdate ) {
            this.props.onUpdate({
                text,
                editorIsOpen: false
            });
        }

        this.setState({
            text,
            editorIsOpen: false,
            isSuccess: true
        });

        // Reset success text
        setTimeout( () => {
            this.setState({
                isSuccess: false
            });
        }, 900);
    }

    enterMarker( e ) {

        if ( this.tooltipHide ) {
            clearTimeout( this.tooltipHide );
        }

        this.setState({
            tooltipIsOpen: true
        });
    }

    leaveMarker( e ) {

        const { editorIsOpen } = this.state;

        // If editing is complete
        if ( !editorIsOpen ) {

            // Hide marker a moment after cursor has left the area
            this.tooltipHide = setTimeout( () => {
                this.setState({
                    tooltipIsOpen: false
                });
            }, 530);
        }
    }

    render() {
        const { position, text, tooltipIsOpen, editorIsOpen, isSuccess } = this.state;
        const { top, left } = position;

        return(
            <React.Fragment>
                <Dot
                    icon={ faDragon }
                    style={{ top, left }}
                    onMouseEnter={ this.enterMarker }
                    onMouseLeave={ this.leaveMarker }>
                </Dot>
                { tooltipIsOpen &&
                    <Tooltip
                        onMouseEnter={ this.enterMarker }
                        onMouseLeave={ this.leaveMarker }
                        style={{
                            top: top + 10,
                            left: left + 10
                        }}>
                        { !editorIsOpen &&
                            <div className="tooltip-content">
                                <a className="tooltip-edit" onClick={ this.editTooltip }>
                                    <Icon icon={ faEdit } />
                                </a>
                                { text }
                                <div className={ classNames('text-success', { 'show': isSuccess }) }>
                                    Saved successfully!
                                </div>
                            </div>
                        }
                        <Editor className={ classNames({ 'show': editorIsOpen }) }>
                            <a className="tooltip-save" onClick={ this.saveTooltip }>
                                <Icon icon={ faSave } />
                            </a>
                            <textarea
                                rows="3"
                                cols="50"
                                ref={this.textInput}
                                defaultValue={ text }></textarea>
                        </Editor>
                    </Tooltip>
                }
            </React.Fragment>
        );
    }
}

Marker.propTypes = {
    text: PropTypes.string.isRequired,
    position: PropTypes.object.isRequired,
    tooltipIsOpen: PropTypes.bool,
    editorIsOpen: PropTypes.bool,
    onUpdate: PropTypes.func,
}

export default Marker;