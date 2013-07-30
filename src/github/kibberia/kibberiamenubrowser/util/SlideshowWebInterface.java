package github.kibberia.kibberiamenubrowser.util;

import android.content.Context;
import android.widget.Toast;

/**
 * Created by Ryan on 5/30/13.
 */
public class SlideshowWebInterface {
    Context mContext;

    public SlideshowWebInterface(Context c)
    {
        mContext = c;
    }


    public void showToast(String toast)
    {
        Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
    }

}
