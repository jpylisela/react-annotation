import React from 'react';
import styled from 'styled-components';
import Marker from './Marker';

/*
    Styles
*/
const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background: #e3faff;
    color: #111111;
`;

const Menu = styled.ul`
    position: absolute;
    min-width: 100px;
    background: white;
    list-style: none;
    padding: 3px 8px;
    border: none;
    box-shadow: 1px 1px 3px 1px rgba(0,0,0,0.18);
    text-align: center;

    li {
        line-height: 25px;
        cursor: pointer;
        user-select: none;
    }
`;

/*
    Annotations component
*/
class Annotations extends React.Component {

    constructor(props) {
        super(props);

        const markers = props.markers || [];

        this.state = {
            markers: markers,
            tooltips: [],
            showMenu: false,
            menu: {}
        };

        this.addMarker = this.addMarker.bind( this );
        this.updateMarker = this.updateMarker.bind( this );
        this.onRightClick = this.onRightClick.bind( this );
    }

    componentDidMount() {

        let { markers } = this.state;

        // Todo: fetch from API instead
        if ( sessionStorage ) {

            // When markers are provided as props, save into sessionStorage
            if ( this.props.markers ) {
                 sessionStorage.setItem( 'markers', JSON.stringify( markers ) );

            // Fetch markers from sessionStorage when saved previously
            } else {
                markers = sessionStorage.getItem( 'markers' ) ? JSON.parse( sessionStorage.getItem( 'markers' ) ) : markers;
            }
        }

        this.setState({
            markers
        });
    }

    onRightClick( e ) {
        e.preventDefault();

        const { pageX: x, pageY: y } = e;

        this.setState({
            showMenu: true,
            menu: { x, y }
        });
    }

    addMarker( e ) {
        e.preventDefault();

        const { markers } = this.state;

        const parentRect = e.currentTarget.parentElement.getBoundingClientRect();

        const { x, y } = parentRect;

        // Create new marker object
        const newMarker = { x, y, text: '', editing: true };

        // Add marker to the list
        markers.push( newMarker );

        // Save to sessionStorage
        sessionStorage.setItem( 'markers', JSON.stringify( markers ) );

        this.setState({
            markers,
            showMenu: false
        });
    }

    updateMarker( index, data ) {
        const { text, editorIsOpen, test } = data;
        const { markers } = this.state;

        if ( typeof text !== 'undefined' ) {
            markers[index].text = text;
        }

        if ( typeof editorIsOpen !== 'undefined' ) {
            markers[index].editing = editorIsOpen;
        }

        // Save to sessionStorage
        sessionStorage.setItem( 'markers', JSON.stringify( markers ) );

        this.setState({
            markers: markers
        });
    }

    render() {

        const { markers, tooltips, showMenu, menu } = this.state;

        return(
            <Container onContextMenu={this.onRightClick}>
                { this.state.markers.map( ( item, index ) => (
                    <Marker
                        key={ index }
                        data-index={ index }
                        position={{
                            top: item.y,
                            left: item.x
                        }}
                        tooltipIsOpen={ item.editing }
                        editorIsOpen={ item.editing }
                        text={ item.text }
                        onUpdate={ (data) => this.updateMarker( index, data ) }
                    />
                ))}
                { showMenu &&
                    <Menu style={{
                        top: menu.y,
                        left: menu.x
                    }}>
                        <li onClick={ this.addMarker }>Create Marker</li>
                    </Menu>
                }
            </Container>
        );
    }
}

export default Annotations;