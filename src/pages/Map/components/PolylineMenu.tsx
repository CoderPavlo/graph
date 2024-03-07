import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, ListItemIcon, ListItemText, Menu, MenuItem, PopoverPosition, TextField } from '@mui/material';
import { Straighten, FmdGood, Edit, Delete } from '@mui/icons-material';
import { ILine, } from '../../../data/interfaces';
import { useTheme } from '@mui/material/styles';
import { useGraph } from '../../../context/Graph';
interface IPolylineMenuProps {
    anchorPosition: PopoverPosition | undefined,
    onClose: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void),
    line?: ILine,
}
export default function PolylineMenu({ anchorPosition, onClose, line }: IPolylineMenuProps) {
    const theme = useTheme();
    const {getNodesFromLine} = useGraph();
    const { source, target } = line ? getNodesFromLine(line) : { source: undefined, target: undefined };
    const menuItemList = [
        { Icon: FmdGood, label: 'м. ' + source?.name, },
        { Icon: FmdGood, label: 'м. ' + target?.name, },
        { Icon: Straighten, label: line?.weight + ' км.', },
    ]

    const { updateLine, deleteLine } = useGraph();
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false);
    const [changeDialogOpen, setChangeDialogOpen] = React.useState<boolean>(false);
    const [weightError, setWeightError] = React.useState<boolean>(false);
    const [weight, setWeight] = React.useState<string>('');

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
                <MenuItem onClick={() => setChangeDialogOpen(true)}>
                    <ListItemIcon>
                        <Edit color='warning' fontSize="small" />
                    </ListItemIcon>
                    <ListItemText sx={{ color: theme.palette.warning.main }}>Редагувати</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => setDeleteDialogOpen(true)}>
                    <ListItemIcon>
                        <Delete color='error' fontSize="small" />
                    </ListItemIcon>
                    <ListItemText sx={{ color: theme.palette.error.main }}>Видалити</ListItemText>
                </MenuItem>
            </Menu>
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Видалити ребро?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Ця дія призведе до видалення<br />
                        &ensp;ребра:<br />
                        &emsp;– {source?.name + ' - ' + target?.name}<br />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Скасувати</Button>
                    <Button color='error' onClick={() => { deleteLine(line?.id); setDeleteDialogOpen(false); onClose({}, 'backdropClick'); }} autoFocus>
                        Видалити
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={changeDialogOpen}
                onClose={() => setChangeDialogOpen(false)}>
                <DialogTitle>Редагування</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Введіть нову вагу для ребра: {source?.name + ' - ' + target?.name}:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="weight"
                        label="Вага"
                        fullWidth
                        variant="standard"
                        value={weight}
                        error={weightError}
                        onChange={(e) => {
                            if (isNaN(Number(e.target.value)))
                                setWeightError(true);
                            else {
                                setWeightError(false);
                                setWeight(e.target.value);
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {setChangeDialogOpen(false); setWeight('')}}>Скасувати</Button>
                    <Button disabled={weight === ''} color='warning'
                        onClick={() => { updateLine(line?.id, Number(weight)); setWeight(''); setChangeDialogOpen(false); onClose({}, 'backdropClick'); }}>Змінити</Button>
                </DialogActions>
            </Dialog >
        </>
    )
}
