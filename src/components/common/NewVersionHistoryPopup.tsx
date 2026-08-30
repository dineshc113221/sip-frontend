import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    IconButton,
    SvgIcon
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../../assets/css/admin-page.scss";
import CalendarIconSvg from "../../assets/images/kenvue_icon_calendar.svg";
import Error from "../../assets/images/error.svg";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const CalendarIcon = (props) => (
    <SvgIcon {...props} viewBox="0 0 24 24">
        <image href={CalendarIconSvg} width="24" height="24" />
    </SvgIcon>
);

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: FormData) => void;
    existingVersions: string[];
}

export interface FormData {
    version_number: string;
    date: string;
    what_change: string;
    description?: string;
}

const MAX_VERSION = 100;
const MAX_CHANGES = 500;

const initialForm: FormData = {
    version_number: "",
    date: "",
    what_change: "",
    description: ""
};

const NewVersionHistoryPopup: React.FC<Props> = ({
    open,
    onClose,
    onSubmit,
    existingVersions
}) => {
    const [form, setForm] = useState<FormData>(initialForm);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (open) {
            setForm(initialForm);
            setTouched({});
            setSubmitted(false);
        }
    }, [open]);

    const handleChange =
        (field: keyof FormData) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                let value = e.target.value;
                if (field === "version_number") {
                    value = value.replace(/[^0-9.]/g, "");
                }

                if (field === "version_number" && value.length > MAX_VERSION) {
                    value = value.slice(0, MAX_VERSION);
                }
                setForm({ ...form, [field]: value });
            };

    const handleBlur = (field: keyof FormData) => {
        setTouched({ ...touched, [field]: true });
    };

    const isDuplicateVersion = existingVersions
        .map(v => v?.toLowerCase())
        .includes(form.version_number.trim().toLowerCase());

    const showRequiredError = (field: keyof FormData) =>
        (touched[field] || submitted) && !form[field];

    const isFormValid =
        form.version_number &&
        form.date &&
        form.what_change &&
        !isDuplicateVersion;

    const handleSubmit = () => {
        setSubmitted(true);
        if (!isFormValid) return;
        onSubmit(form);
        onClose();
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{
                style: { borderRadius: "32px", width: "708px", maxWidth: "none", height: "614px" },
            }}>
                <DialogTitle sx={{ fontWeight: 700, paddingBottom: "0px", fontSize: "33.18px", fontFamily: "kenvue-sans" }}>
                    New Version History
                    <IconButton
                        onClick={onClose}
                        sx={{ position: "absolute", right: 8, top: "28px", width: "44px", height: "44px" }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Box display="flex" flexDirection="column">
                        {/* Version Name */}
                        <Box mt={3} style={{ width: "644px", height: "112px" }}>
                            <Typography className="version-history-fields" style={{ display: "flex", alignItems: "flex-end" }}>
                                Version Name<p style={{ color: "#EC0000", height: "7px" }}>*</p>
                            </Typography>
                            <TextField
                                className="version-history-input"
                                value={form.version_number}
                                onChange={handleChange("version_number")}
                                onBlur={() => handleBlur("version_number")}
                                error={showRequiredError("version_number") || isDuplicateVersion}
                                sx={{
                                    "& .MuiOutlinedInput-input": {
                                        fontFamily: "Inter, sans-serif",
                                    },
                                    border: isDuplicateVersion || showRequiredError("version_number") ? "1px solid #EC0000" : "inherit",
                                    borderRadius: isDuplicateVersion || showRequiredError("version_number") ? "5px" : "inherit"
                                }}
                                inputProps={{
                                    maxLength: MAX_VERSION,
                                }}
                                onWheel={(e) => (e.target as HTMLElement).blur()}
                                fullWidth
                                size="small"
                            />
                            <div style={{ display: "flex", flexDirection: "column", paddingTop: "10px" }}>
                                <Typography className="caption-version-history" variant="caption">
                                    {isDuplicateVersion
                                        ? <div style={{ display: "flex", paddingBottom: "2px" }}><img src={Error} alt="error" /> <Typography style={{ color: "#EC0000", fontFamily: "kenvue-sans-regular", paddingLeft: "2px" }}>Version name is already in use.</Typography></div>
                                        : ""}
                                </Typography>
                                <Typography className="caption-version-history" variant="caption">
                                    Characters left: {MAX_VERSION - form.version_number.length}
                                </Typography>
                            </div>
                        </Box>

                        {/* Date */}
                        <Box mt={3} sx={{ width: "420px", height: "84px" }}>
                            <Typography className="version-history-fields" fontWeight={500} style={{ display: "flex", alignItems: "flex-end" }}>Select Date<p style={{ color: "#EC0000", height: "7px" }}>*</p></Typography>

                            <DatePicker
                                className="version-history-input"
                                format="DD/MM/YYYY"
                                value={form.date ? dayjs(form.date, "DD-MM-YYYY") : null}
                                onChange={(newValue) => {
                                    const formatted = newValue ? newValue.format("DD-MM-YYYY") : "";
                                    setForm({ ...form, date: formatted });
                                }}
                                slots={{
                                    openPickerIcon: CalendarIcon
                                }}
                                slotProps={{
                                    textField: {
                                        className: "version-history-input",
                                        fullWidth: true,
                                        size: "small",
                                        error: !!showRequiredError("date"),
                                        onBlur: () => handleBlur("date"),
                                        placeholder: "dd/mm/yyyy",
                                    }
                                }}
                                sx={{
                                    border: showRequiredError("date") ? "2px solid #EC0000" : "inherit",
                                    borderRadius: showRequiredError("date") ? "5px" : "inherit",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        border: showRequiredError("date") ? "none" : undefined
                                    }
                                }}
                            />
                        </Box>

                        {/* What's Changed */}
                        <Box mt={3} style={{ width: "644px", height: "160px" }}>
                            <Typography className="version-history-fields" fontWeight={500} style={{ display: "flex", alignItems: "flex-end" }}>What’s Changed?<p style={{ color: "#EC0000", height: "7px" }}>*</p></Typography>
                            <TextField
                                className="version-history-input"
                                value={form.what_change}
                                onChange={handleChange("what_change")}
                                onBlur={() => handleBlur("what_change")}
                                error={showRequiredError("what_change")}
                                multiline
                                minRows={4}
                                sx={{
                                    border: showRequiredError("what_change") ? "1px solid #EC0000" : "inherit",
                                    borderRadius: showRequiredError("what_change") ? "5px" : "inherit"
                                }}
                                inputProps={{
                                    maxLength: MAX_CHANGES
                                }}
                                fullWidth
                                size="small"
                            />
                            <Typography className="caption-version-history" variant="caption">
                                Characters left: {MAX_CHANGES - form.what_change.length}
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2, justifyContent: "flex-start" }}>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        className="version-history-form-submit"
                        sx={{
                            borderRadius: "999px",
                            textTransform: "none",
                            px: 4,
                            width: "108px",
                            height: "56px",
                            background: "#000000"
                        }}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

export default NewVersionHistoryPopup;