import { Anchor,Center} from "@mantine/core";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate();
    return(
        <div>
            <div>
                <Center>
                    <h1>
                        EZ AZ OLDAL JELENLEG NEM ELÉRHETŐ
                    </h1>
                </Center>
            </div>
            <div>
                    <Center>
                        <Anchor
                            component="button"
                            type="button"
                            c="dimmed"
                            onClick={() => navigate('/login')}
                            size="xs">
                            Vissza a bejelentkezéshez
                        </Anchor>
                    </Center>
            </div>
        </div>
    );
};


export default ForgotPassword;