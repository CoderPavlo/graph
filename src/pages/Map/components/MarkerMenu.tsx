import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, ListItemIcon, ListItemText, Menu, MenuItem, PopoverPosition } from '@mui/material';
import { LocationCity, FmdGood, Map, Delete } from '@mui/icons-material';
import { ILine, INode } from '../../../data/interfaces';
import { useTheme } from '@mui/material/styles';
import { useGraph } from '../../../context/Graph';
interface IMarkerMenuProps {
    anchorPosition: PopoverPosition | undefined,
    onClose: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void),
    node?: INode,
}
export default function MarkerMenu({ anchorPosition, onClose, node }: IMarkerMenuProps) {
    const theme = useTheme();
    const menuItemList = [
        { Icon: FmdGood, label: 'м. ' + node?.name, },
        { Icon: LocationCity, label: node?.district, },
        { Icon: Map, label: node?.state, },
    ]

    const { lines, deleteNode } = useGraph();

    const deleteClick = () => {
        setDeleteLines(lines.filter(item => item.source.id === node?.id || item.target.id === node?.id));
        setDialogOpen(true);

    }

    const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
    const [deleteLines, setDeleteLines] = React.useState<ILine[]>([]);
    return (
        <>
            <Menu
                anchorReference="anchorPosition"
                anchorPosition={anchorPosition}
                open={Boolean(anchorPosition)}
                onClose={onClose}
            >
                {menuItemList.map((item, index) =>
                    <MenuItem key={index} aria-readonly>
                        <ListItemIcon>
                            <item.Icon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>{item.label}</ListItemText>
                    </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={deleteClick}>
                    <ListItemIcon>
                        <Delete color='error' fontSize="small" />
                    </ListItemIcon>
                    <ListItemText sx={{ color: theme.palette.error.main }}>Видалити</ListItemText>
                </MenuItem>
            </Menu>
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Видалити вершину?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Ця дія призведе до видалення<br />
                        &ensp;вершини:<br />
                        &emsp;– м. {node?.name}<br />
                        {deleteLines.length > 0 &&
                            <>
                                &ensp;ребер:<br />
                            </>
                        }
                        {deleteLines.map((item, index) =>
                            <div key={index}>
                                &emsp;– {item.source.name + ' - ' + item.target.name}<br />
                            </div>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Скасувати</Button>
                    <Button color='error' onClick={() => { deleteNode(node?.id); setDialogOpen(false); onClose({}, 'backdropClick'); }} autoFocus>
                        Видалити
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
