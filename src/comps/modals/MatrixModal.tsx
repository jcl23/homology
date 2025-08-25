import React, { useState } from 'react';
import { Button, Modal, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface MatrixModalProps {
    matrix: number[][];
    inputCells: string[];
    outputCells: string[];
    title?: string;
}

export const MatrixModal: React.FC<MatrixModalProps> = ({ matrix, inputCells, outputCells, title = "Matrix View" }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Button variant="outlined" onClick={handleOpen}>
                Show Matrix
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="matrix-modal-title"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'auto',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    overflow: 'auto'
                }}>
                    <Typography id="matrix-modal-title" variant="h6" component="h2" mb={2}>
                        {title}
                    </Typography>
                    
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell> {/* Empty corner cell */}
                                    {outputCells.map((cell, idx) => (
                                        <TableCell key={idx} align="center" sx={{ fontWeight: 'bold' }}>
                                            {cell}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {matrix.map((row, rowIdx) => (
                                    <TableRow key={rowIdx}>
                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                                            {inputCells[rowIdx]}
                                        </TableCell>
                                        {row.map((cell, colIdx) => (
                                            <TableCell key={colIdx} align="center">
                                                {cell}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Modal>
        </>
    );
};

export default MatrixModal;
