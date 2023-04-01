import Button from '@mui/joy/Button';
import * as React from 'react';
import { FormControl, Textarea } from '@mui/joy';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';


export const CommentDialog = ({status, handleClose, updateData, default_comment, student_name}) => {
    return (
        <Modal open={status} onClose={handleClose}>
            <ModalDialog
                aria-labelledby="basic-modal-dialog-title"
                aria-describedby="basic-modal-dialog-description"
                sx={{ width: 500 }}
            >
                <Stack sx={{mb: 2}}>
                    <Stack spacing={3}>
                        <ModalClose />
                        <Typography level="h4">
                            Комментарий для:
                        </Typography>
                    </Stack>
                        <Typography level="h5">
                            {student_name}
                        </Typography>
                </Stack>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleClose();
                        updateData(event);
                    }}
                >
                    <Stack spacing={2}>
                        <FormControl>
                            {/* <FormLabel>
                                <Typography level='h6'>Текст</Typography>
                            </FormLabel> */}
                            <Textarea 
                                name='comment' 
                                size='md' 
                                minRows='5' 
                                autoFocus 
                                required
                                defaultValue={default_comment ? default_comment : ''}
                            />
                        </FormControl>
                        <Button type="submit">
                            <Typography level='h6' color='white'>Сохранить</Typography>
                        </Button>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    );
}